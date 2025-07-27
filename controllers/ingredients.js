const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
const removeIngredientIdFromRecipes = require('../middleware/remove-ingredient-id-from-recipes.js');
const testIfNewIngredientExists = require('../middleware/test-if-new-ingredient-exists.js');

// routes
router.get('/', async (req, res) => { // display all ingredients
  try {
    const ingredients = await Ingredient.find({ owner: req.session.user._id });
    ingredients.sort((a, b) => a.name.localeCompare(b.name));
    res.render('ingredients/index.ejs', { ingredients: ingredients });
  } catch (err) {
    console.log(err);
    res.send(err);
  };
});

router.post('/', testIfNewIngredientExists, async (req, res) => { // handle request to create a new ingredient
  try {
    await Ingredient.create(req.body);
    if (req.body.returnPage) { return res.redirect(req.body.returnPage); }; // return to a page if required
    return res.redirect('/ingredients');
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  };
});

router.get('/new', async (req, res) => { // display ingredient creation page
  try {
    res.render('ingredients/new.ejs');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  };
});

router.get('/:id', async (req, res) => { // display full ingredient page
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    let recipes = await Recipe.findById(ingredient.recipes);
    if (!Array.isArray(recipes)) { recipes = [recipes] };
    res.render('ingredients/show.ejs', { ingredient: ingredient, recipes: recipes });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  };
});

router.get('/:id/edit', async (req, res) => { // display edit page for an ingredient
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    res.render('ingredients/edit.ejs', { ingredient: ingredient });
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  };
});

router.put('/:id', async (req, res) => { // handle ingredient update requests
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    req.body.name = req.body.displayName.toLowerCase();
    ingredient.set(req.body);
    await ingredient.save();
    res.redirect(`/ingredients/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  }
});

router.delete('/:id', removeIngredientIdFromRecipes, async (req, res) => { // handle ingredient delete requests
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.redirect('/ingredients');
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  };
});

module.exports = router;