const express = require("express");

const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getAppointmentsByPatientId,
  getDoctorBookedSlots,
  getAppointmentsForDoctor,
} = require("../controllers/appointmentController");

router.post("/book", bookAppointment); // POST /api/appointments/book
router.get("/", getAppointments); // GET /api/appointments
router.delete("/:id", cancelAppointment); // DELETE /api/appointments/:id
router.get("/patient/:patientId", getAppointmentsByPatientId);
router.get("/doctor/booked-slots", getDoctorBookedSlots);
router.get("/doctor/:doctorId", getAppointmentsForDoctor);
router.get("/test/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
