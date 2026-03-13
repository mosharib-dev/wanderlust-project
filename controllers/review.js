const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.create = async (req,res) => {  
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currentUser._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Successfully added a new review!!");
    res.redirect(`/listing/${listing._id}`);

};

module.exports.delete = async (req,res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review!!");
    res.redirect(`/listing/${id}`);
};