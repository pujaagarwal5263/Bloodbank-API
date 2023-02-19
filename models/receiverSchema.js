const mongoose = require("mongoose");

const receiverSchema = mongoose.Schema({
    receiverName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      default:"receiver"
    }
});

const Receiver = mongoose.model("Receiver", receiverSchema);
module.exports = Receiver;