const mongoose = require("mongoose");

const hospitalSchema = mongoose.Schema({
    hospital_name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    hospitalID: {
      type: String,
      required: true,
    },
    bloodSamples: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodSample",
      },
    ],
    role:{
      type: String,
      default:"hospital"
    }
  });

const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;