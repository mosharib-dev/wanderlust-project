const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema , reviewschema } = require("./schema.js");

// to validate the listing data coming from the form (server side validation)
module.exports.validatelisting = (req,res,next) => {
    let {error} = listingschema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);   
    }
    else{
        next();
    }
}

// to validate the review data coming from the form(server side validation)
module.exports.validatereview = (req,res,next) => {
    let { error } = reviewschema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);   
    }
    else{
        next();
    }
}

// to check if the user is logged in or not
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // store the url they are requesting in session, so that after login we can redirect them to that url.
        req.flash("error","You must be signed in to create a listing!!");
        return res.redirect("/login");
    }
    next();
}

// to check if the user is the owner of the listing or not
module.exports.saveReturnTo = (req,res,next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo; 
    }
    next();
};

// to check if the user is the owner of the listing or not before allowing them to edit or delete the listing
module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

// to check if the user is the author of the review or not before allowing them to delete the review
module.exports.isreviewAuthor = async (req,res,next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review!!");
        return res.redirect(`/listing/${id}`);
    }   
    next();
}