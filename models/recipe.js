const mongoose = require('mongoose');
const data = require('./schemaRefs.js');

const unitTypes = ['cup', 'gallon', 'liter', 'ounce', 'pint', 'quart', 'tablespoon', 'teaspoon',];

const ingredientRefSchema = mongoose.Schema({
  refId: data.requiredString,
  qty: data.requiredNumber,
  unit: { type: String, enum: unitTypes, required: true, },
});

const recipeSchema = mongoose.Schema({
  name: data.requiredString,
  instructions: String,
  owner: data.requiredMongObjId,
  ingredients: [ingredientRefSchema],
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
