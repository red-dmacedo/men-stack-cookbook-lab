const Ingredient = require('../models/user.js');

const removeRecipeIdFromAllIngredients = async (req, res, next) => {
  try{
    const ingredients = await Ingredient.find({ "recipes": req.params.id }); // get ingredients where "recipes" contains the corresponding recipe id 
    ingredients.forEach( async (el) => {
        await Ingredient.findByIdAndUpdate( {_id: el._id }, { $pull: { recipes: req.params.id }}, ); // remove the recipe id from each ingredient
    });
    next();
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  };
};

module.exports = removeRecipeIdFromAllIngredients;