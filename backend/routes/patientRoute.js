// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getPatientProfile,
  updatePatientProfile,
} = require("../controllers/patientController");

router.get("/profile/:id", getPatientProfile);
router.put("/profile/:id", updatePatientProfile);

module.exports = router;
