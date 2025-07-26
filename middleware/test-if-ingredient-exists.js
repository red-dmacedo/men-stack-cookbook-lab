const Ingredient = require("../models/ingredient");

const testIfNewIngredientExists = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const displayName = req.body.displayName;
    const ingredient = await Ingredient.findOne({ owner: userId, name: displayName.toLowerCase(), });
    if (ingredient !== null) { return res.render('ingredients/name-taken.ejs', { name: displayName }); };
    req.body.name = displayName.toLowerCase(); // set name if ingredient does not exist
    req.body.owner = userId; // set user id as owner of the ingredient
    console.log(req.body);
    next();
  } catch (err) {
    console.log(err);
    res.redirect('/ingredients');
  }
};

module.exports = testIfNewIngredientExists;