const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
const unitTypes = ['cup', 'gallon', 'liter', 'ounce', 'pint', 'quart', 'tablespoon', 'teaspoon',];

// routes
router.get('/', async (req, res) => { // display recipes on index page
  const userId = req.session.user._id;
  const arrRecipes = await Recipe.find({ owner: userId }); // find all recipes owned by the user
  res.render('recipes/index.ejs', { recipes: arrRecipes });
});

router.post('/', async (req, res) => { // handle request to create a new recipe
  try {
    req.body.ingredients = req.body.ingredients.filter(el => el.refId && el.qty && el.unit); // remove ingredients with empty attributes
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id; // assign recipe owner
    await newRecipe.save();

    const user = await User.findById(req.session.user._id); // add recipe to user's list of recipes
    user.recipes.push(newRecipe._id);
    await user.save();

    req.body.ingredients.forEach(async (el) => { // add recipe id to ingredient
      const ingr = await Ingredient.findById(el.refId);
      ingr.recipes.push(newRecipe._id);
      await ingr.save();
    });

    res.redirect('/recipes');
  } catch (err) {
    console.log(err);
    res.redirect('/recipes');
  };
});

router.get('/new', async (req, res) => { // display recipe creation page
  let ingredients = await Ingredient.find({ owner: req.session.user._id });
  if (!Array.isArray(ingredients)) ingredients = [ingredients];
  ingredients.sort((a, b) => a.name.localeCompare(b.name));
  res.render('recipes/new.ejs', { ingredients: ingredients, unitTypes: unitTypes });
});

router.get('/:id', async (req, res) => { // display full recipe page
  const recipe = await Recipe.findById(req.params.id);
  // console.log(recipe);
  // let ingredients = await Ingredient.findById(recipe.ingredients.map(el => el.refId));
  const recipeIngredientIds = recipe.ingredients.map(el => el.refId);
  // console.log(recipeIngredientIds);
  let ingredients = await Ingredient.find({ _id: { $in: recipeIngredientIds } });
  // console.log(ingredients);
  if (!Array.isArray(ingredients)) { ingredients = [ingredients] };
  res.render('recipes/show.ejs', { recipe: recipe, ingredients: ingredients });
});

router.delete('/:id', async (req, res) => { // handle request to delete a recipe
  // add logic for removing id from ingredients
  const recipe = await Recipe.findById(req.params.id);
  const user = await User.findById(req.session.user._id);
  // console.log(recipe);

  user.recipes = user.recipes.filter(el => el.toString() !== recipe._id.toString()); // remove from user's recipe list
  await user.save();

  for (let ingr of recipe.ingredients) { // remove recipe from each ingredient's recipe list
    const ingredient = await Ingredient.findById(ingr.refId);
    console.log(ingredient);
    ingredient.recipes = ingredient.recipes.filter(el => el.toString() !== recipe._id.toString());
    // const recipeIdx = ingredient.recipes.findIndex(el => el.toString() === recipe._id.toString());
    // ingredient.recipes.splice(recipeIdx, 1);
    await ingredient.save();
  };

  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect('/recipes');
});

router.get('/:id/edit', async (req, res) => { // display the edit page for a recipe
  const recipe = await Recipe.findById(req.params.id);
  const ingredients = await Ingredient.find({ owner: req.session.user._id });
  res.render('recipes/edit.ejs', { recipe: recipe, ingredients: ingredients, unitTypes: unitTypes });
});

router.put('/:id', async (req, res) => { // handle request to edit a recipe
  const recipe = await Recipe.findById(req.params.id);
  req.body.ingredients = req.body.ingredients.filter(el => el.refId && el.qty && el.unit); // remove ingredients with empty attributes
  const oldRecipe = await Recipe.findById(req.params.id);
  const oldIngredientIds = oldRecipe.ingredients.map(el => el.refId);
  const newIngredientIds = req.body.ingredients.map(el => el.refId);

  const addedIngredientIds = newIngredientIds.filter(el => !oldIngredientIds.includes(el.toString())); // diff new and old ingredients
  const removedIngredientIds = oldIngredientIds.filter(el => !newIngredientIds.includes(el.toString())); // diff new and old ingredients

  req.body.ingredients.forEach((el) => { // convert object Id strings to mongoose ObjectIds
    if (typeof el.refId !== 'string') return el; // only allow string conversion
    el.refId = new mongoose.Types.ObjectId(el.refId); // convert string to ObjectId
    return el;
  });

  const addedIngredients = await Ingredient.find({ _id: { $in: addedIngredientIds } }); // find all ingredients
  addedIngredients.forEach(async (ingr) => { // add recipe id to new ingredients.recipes list
    ingr.recipes.push(recipe._id);
    await ingr.save()
  });

  const removedIngredients = await Ingredient.find({ _id: { $in: removedIngredientIds } }); // find all ingredients
  removedIngredients.forEach(async (ingr) => { // get ingredients that were removed and remove the recipe id
    ingr.recipes = ingr.recipes.filter(el => el.toString() !== recipe._id.toString());
    await ingr.save();
  });

  await Recipe.findByIdAndUpdate(req.params.id, req.body); // update recipe
  res.redirect(`/recipes/${req.params.id}`);
});

module.exports = router;
