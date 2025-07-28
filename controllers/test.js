const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

const recipe2Id = '6885da8eae04715ddea27b6c';
const recipe2IngrRefId = '6884be00c8b674a5264db842';

router.get('/', async (req, res) => { // test route
  try {
    const user = User.findById(req.session.user._id); // get curent user
    const recipe2 = Recipe.findById(recipe2Id); // get recipe2
  } catch (err) {
    console.log(err);
    res.redirect('/auth/sign-in');
  }
});

module.exports = router;