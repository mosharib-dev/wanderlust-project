const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    nights: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    },
    bookingId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


bookingSchema.pre("save", async function() {
    if (!this.bookingId) {
        this.bookingId = "WL" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
    }
});

module.exports = mongoose.model("Booking", bookingSchema);