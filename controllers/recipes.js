const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// routes
router.get('/', async (req, res) => { // display recipes on index page
  const userId = req.session.user._id;
  const arrRecipes = await Recipe.find({owner: userId}); // find all recipes owned by the user
  res.render('recipes/index.ejs', {recipes: arrRecipes});
});

router.post('/', async (req, res) => { // handle request to create a new recipe
  try{
    console.log(req.body);
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id; // assign recipe owner
    await newRecipe.save();
    const user = await User.findById(req.session.user._id); // add recipe to user's list of recipes
    user.recipes.push(newRecipe._id);
    await user.save();
    req.body.ingredients.forEach( async (el) => { // add recipe id to ingredient
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
  if(!Array.isArray(ingredients)) ingredients = [ingredients];
  ingredients.sort((a, b) => a.name.localeCompare(b.name));
  const unitTypes = ['cup', 'gallon', 'liter', 'ounce', 'pint', 'quart', 'tablespoon', 'teaspoon',];
  res.render('recipes/new.ejs', {ingredients: ingredients, unitTypes: unitTypes});
});

router.get('/:id', async (req, res) => { // display full recipe page
  const recipe = await Recipe.findById(req.params.id);
  recipe.ingredientNames = await getIngredientNamesById(recipe.ingredients); // convert ids to names
  res.render('recipes/show.ejs', {recipe: recipe});
});

router.delete('/:id', async (req, res) => { // handle request to delete a recipe
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect('/recipes');
});

router.get('/:id/edit', async (req, res) => { // display the edit page for a recipe
  const recipe = await Recipe.findById(req.params.id);
  recipe.ingredientNames = await getIngredientNamesById(recipe.ingredients);
  res.render('recipes/edit.ejs', { recipe: recipe });
});

router.put('/:id', async (req, res) => { // handle request to edit a recipe
  let bodyIngredients = req.body.ingredients;
  if(typeof bodyIngredients !== 'array') bodyIngredients = [bodyIngredients];
  const arrIngredients  = (await getAndCreateIngredientsByName(bodyIngredients)).map(el => el._id);
  req.body.ingredients = arrIngredients;
  console.log(req.body);
  // await Recipe.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/recipes/${req.params.id}`);
});

async function getIngredientNamesById(arr){
  const names = [];
  for(let id of arr){
    let obj = await Ingredient.findById(id);
    if(obj === null) {names.push(id)} else { names.push( obj.name ); };
    
  };
  return names;
};

async function getIngredientIdsByName(arr){
  const objIds = [];
  for(let n of arr){
    let obj = await Ingredient.findOne({name: n.toLowerCase()});
    if(obj === null) continue; // skip name if it was not found
    objIds.push( obj._id );
  };
  return objIds;
};

async function createIngredient(name){
  const ingr = new Ingredient({name: name});
  await ingr.save();
  return ingr;
  // nameObj = {name: name};
  // await Ingredient.create(nameObj);
  // return await Ingredient.findOne(nameObj);
};

async function getAndCreateIngredientsByName(arrNames){
  const ingredientObjs = [];

  for(let n of arrNames){
    if(!n) continue; // skip empty inputs
    let ingr;
    ingr = await Ingredient.findOne({name: n});
    if(ingr === null || ingr === undefined) ingr = await createIngredient(n);
    
    ingredientObjs.push(ingr);
  };

  return ingredientObjs;
};

async function getIngredientsById(arrIngredientIds){
  const ingredients = await Ingredient.findById(arrIngredientIds);
  return ingredients;
};

async function getIngredientNameFromId(ingredientId){
  const ingredient = await Ingredient.findById(ingredientId);
  return ingredient.name;
};

module.exports = router;