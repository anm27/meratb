const mongoose = require("mongoose");

const TravelDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  matchedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: "1h", // This will ensure the document is automatically deleted after 1 hour
  },
});

module.exports = mongoose.model("TravelDetails", TravelDetailsSchema);
