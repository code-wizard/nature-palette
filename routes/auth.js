
const authContollers = require("../controllers/auth");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.get("/current", auth, async (req, res) => {
//     const user = await User.findById(req.user._id).select("-password");
//     res.send(user);
//   });
// router.get("/register", async );

router.get("/register",  authContollers.getRegister);
router.post("/register", authContollers.registrationValidation, passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/auth/register'
}));
router.get("/login", authContollers.getLogin);
router.get("/logout", authContollers.getLogout);
router.post("/login", passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/auth/login'
}));
module.exports = router;