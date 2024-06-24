//sign in form

const express = require("express");
const router  = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../views/middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signUp));


router.route("/login")
.get( userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: '/login',
     failureFlash: true}),

     userController.login
);

router.get("/logout", userController.logOut);

module.exports = router;