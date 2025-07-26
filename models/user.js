const mongoose = require('mongoose');
const data = require('./schemaRefs.js');

const recipeRefSchema = mongoose.Schema({ refId: data.requiredMongObjId, });

const userSchema = mongoose.Schema({
  username: data.requiredString,
  password: data.requiredString,
  recipes: [recipeRefSchema], // recipes owned by the user
  savedRecipes: [recipeRefSchema], // save recipes created by the community
});

const User = mongoose.model('User', userSchema);

module.exports = User;
