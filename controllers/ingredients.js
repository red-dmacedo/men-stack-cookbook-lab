const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
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
    const ingredient = await Ingredient.findById(req.params.id); // get ingredient
    let recipes = await Recipe.find({ _id: { $in: ingredient.recipes } }); // get recipes that use this ingredient
    if (!Array.isArray(recipes)) { recipes = [recipes] }; // convert single ingredient to an array of one ingredient (helps with page loop)
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
    req.body.name = req.body.displayName.toLowerCase(); // set name property
    ingredient.set(req.body); // update ingredient
    await ingredient.save(); // save in database
    res.redirect(`/ingredients/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  }
});

router.delete('/:id', async (req, res) => { // handle ingredient delete requests
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    let recipes = Recipe.find({ 'ingredients.refId': req.params.id });
    if(!Array.isArray(recipes)){recipes = [recipes]};
    recipes.forEach(async (recipe) => { // remove ingredient from recipes
      const ingrIndex = recipe.ingredients.findIndex(`${ingredient._id}`);
      recipe.ingredients.splice(ingrIndex, 1);
      await recipe.save();
    });

    // await Ingredient.findByIdAndDelete(req.params.id); // delete the ingredient
    res.redirect('/ingredients');
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  };
});

module.exports = router;