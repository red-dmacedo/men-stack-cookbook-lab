const mongoose = require('mongoose');
const data = require('./schemaRefs.js');

const recipeRefSchema = mongoose.Schema({ refId: data.requiredMongObjId, });

const ingredientSchema = mongoose.Schema({
  name: data.requiredString,
  displayName: data.requiredString,
  owner: data.requiredString,
  recipes: [recipeRefSchema],
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
