const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String },
  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
  },
});

module.exports = mongoose.model("Message", messageSchema);
