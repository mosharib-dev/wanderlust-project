const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const bookingController = require("../controllers/booking.js");

router.use((req, res, next) => {
    next();
});

router.get("/new", wrapAsync(bookingController.showBookingPage));
router.post("/", wrapAsync(bookingController.createBooking));

module.exports = router;