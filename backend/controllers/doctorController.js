const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create doctor
exports.createDoctor = async (req, res) => {
  try {
    const doctor = new User(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    res.status(200).json(doctor);
    console.log("Requested doctor ID:", req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id); // assuming `authMiddleware` sets req.user
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// POST /api/doctors/login
exports.doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await User.findOne({ email });

    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Create JWT with doctor ID
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, doctor });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

//Doctor Profile update

// GET full doctor profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findById(id).lean();
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  try {
    const { name, email, phone, specialization, bio, availability } = req.body;

    const updatedDoctor = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, specialization, bio, availability },
      { new: true }
    );

    if (!updatedDoctor || updatedDoctor.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(updatedDoctor);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update doctor profile" });
  }
};

exports.updateDoctorPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const doctor = await User.findById(req.params.id);

  const isMatch = await bcrypt.compare(currentPassword, doctor.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  doctor.password = await bcrypt.hash(newPassword, 10);
  await doctor.save();
  res.json({ message: "Password updated successfully" });
};

// controllers/doctorController.js
exports.updateDoctorProfilePic = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // 💡 Make sure file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePhoto = req.file.filename;

    const updatedDoctor = await User.findByIdAndUpdate(
      doctorId,
      { profilephoto: profilePhoto },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated",
      user: updatedDoctor,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// In controllers/userController.js
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "doctor" });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
