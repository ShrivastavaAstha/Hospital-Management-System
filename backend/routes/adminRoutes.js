const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { deleteDoctor } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
// ✅ Add these 2 middlewares:
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllAppointments,
  deleteAppointment,
  getAllBills,
  deleteBill,
  adminAddDoctor,
} = require("../controllers/adminController");

router.get("/appointments", verifyToken, isAdmin, getAllAppointments);
router.delete("/appointments/:id", verifyToken, isAdmin, deleteAppointment);

router.get("/bills", verifyToken, isAdmin, getAllBills);
router.delete("/bills/:id", verifyToken, isAdmin, deleteBill);

// 🔐 Protect this route:
router.get("/dashboard", verifyToken, isAdmin, getDashboardStats);
// doctorRoutes.js
router.delete("/:id", deleteDoctor); // DELETE doctor

// appointmentRoutes.js
// router.delete("/:id", deleteAppointment); // DELETE appointment

// billingRoutes.js
// router.delete("/:id", deleteBill); // DELETE bill

// Allow only admin to add doctor manually
router.post("/doctors/add", verifyToken, isAdmin, adminAddDoctor);

module.exports = router;
