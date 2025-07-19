const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const User = require("../models/User"); // import your user model at the top
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create doctor
exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json(doctor);
    console.log("Requested doctor ID:", req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerDoctor = async (req, res) => {
  try {
    const { name, specialization, phone, email, password } = req.body;

    if (!name || !specialization || !phone || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const doctor = new Doctor({
      _id: new mongoose.Types.ObjectId(), // ✅ Important fix
      name,
      specialization,
      phone,
      email,
      password,
    });

    await doctor.save();

    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (err) {
    console.error("Doctor register error:", err);
    res.status(500).json({ error: err.message || "Failed to register doctor" });
  }
};

// controllers/doctorController.js

exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id); // assuming `authMiddleware` sets req.user
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
    const doctor = await Doctor.findOne({ email });

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

exports.getDoctorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
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

exports.updateDoctorProfilePic = async (req, res) => {
  const doctor = await User.findByIdAndUpdate(
    req.params.id,
    { profilePicture: req.file.filename },
    { new: true }
  );
  res.json(doctor);
};
