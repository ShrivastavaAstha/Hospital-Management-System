const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware.js");
const {
  getPatientProfile,
  updatePatientProfile,
  updatePatientProfilePic,
} = require("../controllers/patientController");

router.get("/profile/:id", getPatientProfile);
router.put("/profile/:id", updatePatientProfile);
router.put(
  "/profile-picture/:id",
  upload.single("profilephoto"),
  updatePatientProfilePic
);

module.exports = router;
