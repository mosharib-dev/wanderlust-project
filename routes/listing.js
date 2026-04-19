const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // image files will saved in storage

// same route for index and create
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.create)
 );


// New Route
router.get("/new",
    isLoggedIn,
    listingController.new);

//  same route for show update and delete
router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.update))
    .delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.delete));


// Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.edit));


module.exports = router;
