const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user || user.role !== "patient") {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePatientProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      address,
      bloodGroup,
      medicalHistory,
      allergies,
      emergencyContact,
    } = req.body;

    let user = await User.findById(req.params.id);

    if (!user || user.role !== "patient") {
      return res.status(404).json({ error: "Patient not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.address = address || user.address;
    user.bloodGroup = bloodGroup || user.bloodGroup;
    user.medicalHistory = medicalHistory || user.medicalHistory;
    user.allergies = allergies || user.allergies;
    user.emergencyContact = emergencyContact || user.emergencyContact;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePatientProfilePic = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePhoto = req.file.filename;

    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      { profilephoto: profilePhoto },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated",
      user: updatedPatient,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
