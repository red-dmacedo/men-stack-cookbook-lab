const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  name: { type: String, required: true, },
  instructions: { type: String, required: false, },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, },
  ingredients: [{
    id: {type: mongoose.Schema.Types.ObjectId, required: false, },
    qty: { type: Number, required: true, },
    unit: {
      type: String,
      enum: ['teaspoon','tablespoon','cup','ounce','liter','gallon','pint','quart'],
      required: true,
    },
  }],
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
