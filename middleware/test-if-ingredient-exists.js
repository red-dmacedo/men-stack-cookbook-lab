const Ingredient = require("../models/ingredient");

const testIfNewIngredientExists = async (req, res, next) => {
  try{
    const ingredient = await Ingredient.findOne({name: req.body.displayName.toLowerCase()});
    if(ingredient === null){ return res.send(`<h1>Name already exists: ${req.body.displayName}</h1>`); };
    req.body.name = req.body.displayName.toLowerCase(); // set name if ingredient does not exist
    next();
  } catch(err){
    console.log(err);
    res.redirect('/ingredients');
  }
};

module.exports = testIfNewIngredientExists;