const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware.js");

const {
  getAllDoctors,
  deleteDoctor,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorPassword,
  updateDoctorProfilePic,
  doctorLogin,
} = require("../controllers/doctorController");

const authMiddleware = require("../middlewares/authDoctor");
const User = require("../models/User");

// ✅ Doctor Login
router.post("/login", doctorLogin);

// ✅ Get Doctor Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/", getAllDoctors);
router.delete("/:id", deleteDoctor);
router.get("/:id", getDoctorById);
router.get("/profile/:id", getDoctorProfile);
router.put("/profile/:id", updateDoctorProfile);
router.put("/password/:id", updateDoctorPassword);

// ✅ Upload Profile Picture
router.put(
  "/profile-picture/:id",
  upload.single("profilephoto"),
  updateDoctorProfilePic
);

// Get user (doctor) by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
