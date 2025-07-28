const mongoose = require('mongoose');
const data = require('./schemaRefs.js');
const Recipe = require('./recipe.js');

const userSchema = mongoose.Schema({
  username: data.requiredString,
  password: data.requiredString,
  recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}], // recipes owned by the user
  savedRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}], // save recipes created by the community
});

const User = mongoose.model('User', userSchema);

module.exports = User;
