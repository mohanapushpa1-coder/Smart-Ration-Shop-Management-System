const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  shopId: String,
  slot: String,
  time: String,
  date: String,
  status: {
    type: String,
    enum: ["booked", "completed"],
    default: "booked"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  collectedAt: {
    type: Date
  }
});

module.exports = mongoose.model("Booking", bookingSchema);