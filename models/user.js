const mongoose = require('mongoose');
const data = require('./schemaRefs.js');

const userSchema = mongoose.Schema({
  username: data.requiredString,
  password: data.requiredString,
  recipes: [data.requiredMongObjId], // recipes owned by the user
  savedRecipes: [data.requiredMongObjId], // save recipes created by the community
});

const User = mongoose.model('User', userSchema);

module.exports = User;
