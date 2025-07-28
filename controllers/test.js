const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

const fancyFeastId = '6887432b953c4da9acfb4bb9';

router.get('/', async (req, res) => { // test route
  try {
    // const user = await User.findById(req.session.user._id); // get curent user
    const ingredient = await Ingredient.findById(fancyFeastId);

    // // Grab recipes individually
    // const recipes = [];
    // for(id of ingredient.recipes){
    //   let rec = await Recipe.findById(id);
    //   recipes.push(rec);
    // };

    

    const recipes2 = await Recipe.find({_id: {$in: ingredient.recipes}}); // working

    console.log(recipes2);

    res.render('index.ejs');
  } catch (err) {
    console.log(err);
    res.redirect('/auth/sign-in');
  }
});

module.exports = router;