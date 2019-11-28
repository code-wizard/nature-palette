const jwt = require("jsonwebtoken");
const config = require('../config.js')


//route middleware to ensure user is logged in
module.exports = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.status(400).json({
      'message': 'access denied'
  });
}