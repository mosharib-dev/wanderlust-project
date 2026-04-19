const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

module.exports.showBookingPage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const listing = await Listing.findById(id).populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }
        if (listing.owner._id.equals(req.user._id)) {
            req.flash("error", "You cannot book your own listing!");
            return res.redirect(`/listing/${id}`);
        }
        res.render("bookings/booking", { listing });
    } catch (err) {
        next(err);
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Email transporter error:", error.message);
    } else {
        console.log("✅ Email transporter ready");
    }
});

function generatePDF(booking) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        doc.fontSize(26).fillColor("#fe424d").text("WanderLust", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor("#222222").text("Booking Confirmation Ticket", { align: "center" });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#fe424d").lineWidth(2).stroke();
        doc.moveDown(1);

        doc.fontSize(12).fillColor("#222222");
        doc.text(`Booking ID   : ${booking.bookingId}`);
        doc.moveDown(0.5);
        doc.text(`Listing      : ${booking.listing.title}`);
        doc.moveDown(0.5);
        doc.text(`Location     : ${booking.listing.location}, ${booking.listing.country}`);
        doc.moveDown(0.5);
        doc.text(`Guest        : ${booking.user.username}`);
        doc.moveDown(0.5);
        doc.text(`Email        : ${booking.user.email}`);
        doc.moveDown(0.5);
        doc.text(`Check-In     : ${new Date(booking.checkIn).toDateString()}`);
        doc.moveDown(0.5);
        doc.text(`Check-Out    : ${new Date(booking.checkOut).toDateString()}`);
        doc.moveDown(0.5);
        doc.text(`Nights       : ${booking.nights}`);
        doc.moveDown(0.5);
        doc.text(`Total Price  : ₹${booking.totalPrice.toLocaleString("en-IN")}`);
        doc.moveDown(0.5);
        doc.text(`Status       : ${booking.status.toUpperCase()}`);
        doc.moveDown(1);

        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#fe424d").lineWidth(2).stroke();
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#888888").text("Thank you for booking with WanderLust!", { align: "center" });
        doc.text("This is an auto-generated ticket. Please carry it during your stay.", { align: "center" });

        doc.end();
    });
}

async function sendConfirmationEmail(booking, pdfBuffer) {
    const mailOptions = {
        from: `"WanderLust" <${process.env.GMAIL_USER}>`,
        to: booking.user.email,
        subject: `Booking Confirmed! 🎉 — ${booking.listing.title}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #fe424d;">WanderLust</h2>
                <h3>Your booking is confirmed! 🎉</h3>
                <p>Hi <b>${booking.user.username}</b>,</p>
                <p>Your booking for <b>${booking.listing.title}</b> has been confirmed.</p>
                <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background:#f5f5f5">
                        <td style="padding:8px; border:1px solid #ddd"><b>Booking ID</b></td>
                        <td style="padding:8px; border:1px solid #ddd">${booking.bookingId}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #ddd"><b>Location</b></td>
                        <td style="padding:8px; border:1px solid #ddd">${booking.listing.location}, ${booking.listing.country}</td>
                    </tr>
                    <tr style="background:#f5f5f5">
                        <td style="padding:8px; border:1px solid #ddd"><b>Check-In</b></td>
                        <td style="padding:8px; border:1px solid #ddd">${new Date(booking.checkIn).toDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #ddd"><b>Check-Out</b></td>
                        <td style="padding:8px; border:1px solid #ddd">${new Date(booking.checkOut).toDateString()}</td>
                    </tr>
                    <tr style="background:#f5f5f5">
                        <td style="padding:8px; border:1px solid #ddd"><b>Nights</b></td>
                        <td style="padding:8px; border:1px solid #ddd">${booking.nights}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #ddd"><b>Total Price</b></td>
                        <td style="padding:8px; border:1px solid #ddd">₹${booking.totalPrice.toLocaleString("en-IN")}</td>
                    </tr>
                </table>
                <p>Your ticket is attached to this email. Please carry it during your stay.</p>
                <p style="color:#888; font-size:12px;">Thank you for choosing WanderLust!</p>
            </div>
        `,
        attachments: [
            {
                filename: `WanderLust_Ticket_${booking.bookingId}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    };

    await transporter.sendMail(mailOptions);
}

module.exports.createBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut } = req.body;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            req.flash("error", "Check-out date must be after check-in date!");
            return res.redirect(`/listing/${id}/book`);
        }

        if (checkInDate < new Date(new Date().toDateString())) {
            req.flash("error", "Check-in date cannot be in the past!");
            return res.redirect(`/listing/${id}/book`);
        }

        const conflictingBooking = await Booking.findOne({
            listing: id,
            status: "confirmed",
            $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }]
        });

        if (conflictingBooking) {
            req.flash("error", "These dates are already booked!");
            return res.redirect(`/listing/${id}/book`);
        }

        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * listing.price;

        const booking = new Booking({
            listing: id,
            user: req.user._id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights,
            totalPrice,
        });

        await booking.save();

        await booking.populate("listing");
        await booking.populate("user");

        const pdfBuffer = await generatePDF(booking);

        try {
            await sendConfirmationEmail(booking, pdfBuffer);
        } catch (emailErr) {
            console.error("Email failed:", emailErr.message);
        }

        req.flash("success", "Booking confirmed! 🎉 Check your email.");
        return res.redirect(`/bookings/my-bookings`);

    } catch (err) {
        console.error("CAUGHT ERROR:", err.message);
        console.error(err.stack);
        next(err);
    }
};

module.exports.myBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 });
        res.render("bookings/my-bookings", { bookings });
    } catch (err) {
        next(err);
    }
};

module.exports.downloadTicket = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.bookingId })
            .populate("listing")
            .populate("user");
        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/bookings/my-bookings");
        }
        if (!booking.user._id.equals(req.user._id)) {
            req.flash("error", "You are not authorized!");
            return res.redirect("/bookings/my-bookings");
        }
        const pdfBuffer = await generatePDF(booking);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=WanderLust_Ticket_${booking.bookingId}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        next(err);
    }
};

function generateLetter(booking) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 60 });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        // Header
        doc.fontSize(28).fillColor("#fe424d").text("WanderLust", { align: "left" });
        doc.moveDown(0.3);
        doc.fontSize(11).fillColor("#888").text("Your home away from home · wanderlust.com", { align: "left" });
        doc.moveDown(0.5);
        doc.moveTo(60, doc.y).lineTo(550, doc.y).strokeColor("#fe424d").lineWidth(1.5).stroke();
        doc.moveDown(1);

        // Date
        doc.fontSize(11).fillColor("#888").text(`Date: ${new Date().toDateString()}`, { align: "right" });
        doc.moveDown(1);

        // Title
        doc.fontSize(18).fillColor("#222").text("Booking Confirmation Letter", { align: "center" });
        doc.moveDown(1.5);

        // Greeting
        doc.fontSize(12).fillColor("#333").text(`Dear ${booking.user.username},`);
        doc.moveDown(0.8);
        doc.text(
            `We are pleased to confirm your reservation at ${booking.listing.title}, located in ${booking.listing.location}, ${booking.listing.country}. Your booking has been successfully processed and confirmed.`,
            { lineGap: 4 }
        );
        doc.moveDown(1.2);

        // Details table
        const rows = [
            ["Booking ID",    booking.bookingId],
            ["Property",      booking.listing.title],
            ["Location",      `${booking.listing.location}, ${booking.listing.country}`],
            ["Guest Name",    booking.user.username],
            ["Email",         booking.user.email],
            ["Check-In",      new Date(booking.checkIn).toDateString()],
            ["Check-Out",     new Date(booking.checkOut).toDateString()],
            ["Duration",      `${booking.nights} night${booking.nights > 1 ? "s" : ""}`],
            ["Total Amount",  `₹${booking.totalPrice.toLocaleString("en-IN")}`],
            ["Status",        "CONFIRMED"],
        ];

        rows.forEach(([label, value], i) => {
            const y = doc.y;
            if (i % 2 === 0) {
                doc.rect(60, y, 490, 22).fillColor("#fafafa").fill();
            }
            doc.fillColor("#555").fontSize(11).text(label, 65, y + 5, { width: 160 });
            doc.fillColor("#222").fontSize(11).text(value, 230, y + 5, { width: 310 });
            doc.moveDown(0.9);
        });

        doc.moveDown(1);
        doc.moveTo(60, doc.y).lineTo(550, doc.y).strokeColor("#ddd").lineWidth(1).stroke();
        doc.moveDown(1);

        // Body
        doc.fontSize(12).fillColor("#333").text(
            "Please present this letter upon arrival at the property. A copy of your booking ticket has also been sent to your registered email address.",
            { lineGap: 4 }
        );
        doc.moveDown(1.5);

        // Signature
        doc.fontSize(12).fillColor("#333").text("Warm regards,");
        doc.moveDown(0.3);
        doc.fontSize(13).fillColor("#fe424d").text("WanderLust Team");
        doc.fontSize(10).fillColor("#888").text("wanderlust.com · support@wanderlust.com");

        doc.end();
    });
}

module.exports.downloadLetter = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.bookingId })
            .populate("listing")
            .populate("user");

        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/bookings/my-bookings");
        }
        if (!booking.user._id.equals(req.user._id)) {
            req.flash("error", "You are not authorized!");
            return res.redirect("/bookings/my-bookings");
        }

        const pdfBuffer = await generateLetter(booking);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=WanderLust_Letter_${booking.bookingId}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        next(err);
    }
};

module.exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.bookingId });
        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/bookings/my-bookings");
        }
        if (!booking.user.equals(req.user._id)) {
            req.flash("error", "You are not authorized!");
            return res.redirect("/bookings/my-bookings");
        }
        booking.status = "cancelled";
        await booking.save();
        req.flash("success", "Booking cancelled successfully!");
        res.redirect("/bookings/my-bookings");
    } catch (err) {
        next(err);
    }
};