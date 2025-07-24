const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// routes
router.get('/', async (req, res) => {
  const userId = req.session.user._id;
  const arrRecipes = await Recipe.find({owner: userId});
  res.render('recipes/index.ejs', {recipes: arrRecipes});
});

router.post('/', async (req, res) => {
  try{
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    // await newRecipe.save();
    console.log('New Recipe:', newRecipe);
    res.send( `<h1>Create Recipe:</h1><p>${JSON.parse(JSON.stringify(newRecipe))}<p>` );
    // res.redirect('recipes/index.ejs');
  } catch (err) {
    console.log(err);
    res.redirect('recipes/index.ejs');
  };
});

router.get('/new', (req, res) => {
  res.render('recipes/new.ejs');
});

router.get('/show', async (req, res) => {
  const userId = req.session.user._id;
  const arrRecipes = await Recipe.find({owner: userId});
  res.render('recipes/show.ejs', {recipes: arrRecipes});
});



module.exports = router;