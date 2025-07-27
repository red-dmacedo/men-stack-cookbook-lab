const mongoose = require('mongoose');
const data = require('./schemaRefs.js');

const ingredientSchema = mongoose.Schema({
  name: data.requiredString,
  displayName: data.requiredString,
  owner: data.requiredString,
  recipes: [data.requiredMongObjId],
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
