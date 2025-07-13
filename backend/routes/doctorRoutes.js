const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  deleteDoctor,
  getDoctorById,
} = require("../controllers/doctorController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { registerDoctor } = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authDoctor");
const Doctor = require("../models/Doctor");
const { doctorLogin } = require("../controllers/doctorController");

router.post("/login", doctorLogin); // POST /api/doctors/login

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
router.post("/add", createDoctor); // POST /api/doctors/add
router.get("/", getAllDoctors); // GET /api/doctors
router.delete("/:id", deleteDoctor); // DELETE /api/doctors/:id
router.get("/:id", getDoctorById);
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, specialization, phone, email, password } = req.body;

    if (!name || !specialization || !phone || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      specialization,
      phone,
      email,
      password: hashedPassword,
    });

    await newDoctor.save();
    res.status(201).json({ success: true, doctor: newDoctor });
  } catch (err) {
    console.error("❌ Add doctor error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/doctors/add
router.post("/add", registerDoctor);

module.exports = router;
