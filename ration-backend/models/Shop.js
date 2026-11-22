const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  stock: {
    rice: Number,
    wheat: Number,
    sugar: Number
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openTime: {
    type: String,
    default: "09:00 AM"
  },
  closeTime: {
    type: String,
    default: "06:00 PM"
  },
  announcement: {
    type: String,
    default: ""
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model("Shop", shopSchema);