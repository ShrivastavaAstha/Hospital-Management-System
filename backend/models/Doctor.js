const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ["Morning", "Evening", "Both"],
    default: "Both",
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilephoto: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
