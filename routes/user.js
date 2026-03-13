const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const { saveReturnTo } = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignup)  // Register Route
    .post(wrapAsync(userController.signup));  // Post Register Route


router.route("/login")
    .get(userController.renderLogin) // Login Route
    .post(saveReturnTo,passport.authenticate("local",  // Post Login Route
    {
        failureRedirect : "/login",
        failureFlash : true
    }), userController.login);

// logout Route
router.get("/logout",userController.logout);

module.exports = router;