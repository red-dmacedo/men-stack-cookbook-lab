const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// routes
router.get('/', async (req, res) => {
  const userId = req.session.user._id;
  const arrRecipes = await Recipe.find({owner: userId});
  res.render('recipes/index.ejs', {recipes: arrRecipes});
});

router.post('/', async (req, res) => {
  try{
    const arrIngredients = [];

    for(let el of req.body.ingredients) {
      if(!el) continue; // skip empty input fields
      const ingrObj = {name: el.toLowerCase()}; // initialize ingredient object
      let ingr = await Ingredient.findOne( ingrObj ); // retrieve existing ingredient

      if(ingr === null){ // create new ingredient if it does not exist
        await Ingredient.create( ingrObj );
        ingr = await Ingredient.findOne( ingrObj );
      };

      arrIngredients.push(ingr._id); // add ingredient id to recipe
    };

    req.body.ingredients = arrIngredients;
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    await newRecipe.save();

    res.redirect('/recipes');
  } catch (err) {
    console.log(err);
    res.redirect('/recipes');
  };
});

router.get('/new', (req, res) => {
  res.render('recipes/new.ejs');
});

router.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('recipes/show.ejs', {recipe: recipe});
});

router.delete('/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect('/recipes');
});

module.exports = router;