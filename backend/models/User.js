const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    // default: "patient",
  },
  profilephoto: { type: String },
  specialization: { type: String },
  phone: { type: String },
  availability: {
    type: String,
    enum: ["Morning", "Evening", "Both"],
    default: undefined,
  },

  // Patient-specific fields (optional by default)
  age: { type: Number },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  address: { type: String },
  bloodGroup: { type: String },
  medicalHistory: {
    type: [String],
    default: undefined,
  },
  allergies: {
    type: [String],
    default: undefined,
  },
  emergencyContact: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
