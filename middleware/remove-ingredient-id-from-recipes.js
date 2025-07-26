const Recipe = require('../models/recipe.js');

const removeIngredientIdFromRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ "ingredients": req.params.id }); // find recipes with a matching ingredient ID
    recipes.forEach(async (el) => {
      await Recipe.findByIdAndUpdate({ _id: el._id }, { $pull: { ingredients: req.params.id } }); // remove ingredient ID from each recipe
    });
    next();
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  };
};

module.exports = removeIngredientIdFromRecipes;