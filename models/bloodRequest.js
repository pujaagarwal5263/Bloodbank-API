const mongoose = require("mongoose");

const bloodRequest = mongoose.Schema({
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receiver",
      required: true,
    },
    hospitalID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: [ "provided", "pending", "denied"],
    },
  });

const BloodRequest = mongoose.model("BloodRequest", bloodRequest);
module.exports = BloodRequest;