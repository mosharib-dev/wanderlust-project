const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// My bookings page
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.myBookings));

// Download PDF ticket
router.get("/:bookingId/ticket", isLoggedIn, wrapAsync(bookingController.downloadTicket));
// Download confirmation letter
router.get("/:bookingId/letter", isLoggedIn, wrapAsync(bookingController.downloadLetter));
// Cancel booking
router.delete("/:bookingId", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;