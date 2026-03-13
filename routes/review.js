const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isreviewAuthor,validatereview} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// create review route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.create));

// delete review route

router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.delete));

module.exports = router;
