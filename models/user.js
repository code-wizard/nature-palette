const config = require('../config.js')
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

mongoose.connect(global.gConfig.database);
//simple schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  //give different access rights if admin or not 
});

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    password_confirmation: Joi.any().valid(Joi.ref('password'))
              .required().options({ language: { any: { allowOnly: 'must match password' } } })

  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;