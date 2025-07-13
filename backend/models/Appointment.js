// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema({
//   patientName: {
//     type: String,
//     required: true,
//   },
//   doctorName: {
//     type: String,
//     required: true,
//   },
//   appointmentDate: {
//     type: Date,
//     required: true,
//   },
//   symptoms: {
//     type: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Appointment", appointmentSchema);
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
