const mongoose = require("mongoose");

const bloodSample = mongoose.Schema({
    bloodGroup: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    hospitalID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  });

const BloodSample = mongoose.model("Bloodsample", bloodSample);
module.exports = BloodSample;