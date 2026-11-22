const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: {
    type: Date,
    default: Date.now
  },
  shopId: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
