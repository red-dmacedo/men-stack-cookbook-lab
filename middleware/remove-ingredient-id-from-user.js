const Recipe = require('../models/recipe.js');

const removeIngredientIdFromRecipes = async (req, res, next) => {
  try{
    const recipes = await Recipe.find({ "ingredients": req.params.id });
    recipes.forEach( async (el) => {
        await Recipe.findByIdAndUpdate(
          {_id: el._id },
          { $pull: { ingredients: req.params.id }},
        );
    });
    next();
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  };
};

module.exports = removeIngredientIdFromRecipes;