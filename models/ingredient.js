const mongoose = require('mongoose');
const data = require('./schemaRefs.js');
const Recipe = require('./recipe.js');

const ingredientSchema = mongoose.Schema({
  name: data.requiredString,
  displayName: data.requiredString,
  owner: data.requiredString,
  recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
