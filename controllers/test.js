const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
const mongoose = require('mongoose');

const fancyFeastId = '6887432b953c4da9acfb4bb9';
const quartzId = '6887bbbad1c4604f94c342f2';

router.get('/', async (req, res) => { // test route
  try {
    // const user = await User.findById(req.session.user._id); // get curent user
    // const ingredient = await Ingredient.findById(fancyFeastId);
    const ingredient = await Ingredient.findById(quartzId);
    const recipes2 = await Recipe.find({ _id: { $in: ingredient.recipes } }); // working
    const quartzIdObj = new mongoose.Types.ObjectId(quartzId);

    // const recipes = Recipe.find({ "ingredients.refId": quartzIdObj });
    const recipes = await Recipe.find({ "ingredients.refId": quartzIdObj });
    // array of all recipes with the refId === quartzId inside the ingredients array of object

    console.log(recipes);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.redirect('/auth/sign-in');
  }
});

module.exports = router;