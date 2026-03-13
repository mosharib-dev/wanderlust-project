const User = require("../models/user.js");

module.exports.renderSignup = (req,res) => {
    res.render("users/signup");
};

module.exports.signup = async (req,res,next) => {
    try{
        const { username,email,password } = req.body;
        const newUser = new User({ username,email });
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,async(err)=> {
            if (err) 
            {
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            return res.redirect("/listing");
        });
    } catch(e) {
        req.flash("error",e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLogin = (req,res) => {
    res.render("users/login");
};

module.exports.login = async(req,res) => {
        req.flash("success","Welcome back to Wanderlust!");
        res.redirect(res.locals.returnTo || "/listing");
};

module.exports.logout = (req,res,next) => {
    req.logout(async(err)=> {
        if (err) 
            { 
                return next(err);
            }
        req.flash("success","You have been logged out!");
        res.redirect("/listing");
    });
};