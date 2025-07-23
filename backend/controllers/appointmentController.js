const Appointment = require("../models/Appointment");
const User = require("../models/User");

// bookAppointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "This slot is already booked. Please choose another." });
    }
    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate,
      appointmentTime,
      paymentStatus: "Pending",
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error("❌ Booking Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get All Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    }).populate({
      path: "doctorId",
      model: "User",
      select: "name specialization email",
    });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getDoctorBookedSlots = async (req, res) => {
  const { doctorId, date } = req.query;

  try {
    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: date,
    });

    const bookedSlots = appointments.map((a) => a.appointmentTime);
    res.json(bookedSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/appointments/doctor/:id
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    console.log("Doctor ID from route:", doctorId); // ✅ Add this

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID missing" });
    }

    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email") // ✅ shows patient info
      .exec();

    console.log("Fetched Appointments:", appointments); // ✅ Add this too

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments for doctor:", err.message);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

exports.getNextAppointmentForPatient = async (req, res) => {
  try {
    const userId = req.params.userId;

    const now = new Date();

    // Fetch all upcoming appointments
    const appointments = await Appointment.find({
      patientId: userId,
    }).populate("doctorId", "name");

    // Filter out appointments that are in the past
    const upcoming = appointments.filter((a) => {
      const dateTime = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
      return dateTime >= now;
    });

    // Sort by date + time
    upcoming.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
      return dateA - dateB;
    });

    if (upcoming.length === 0) {
      return res.status(200).json(null);
    }

    res.status(200).json(upcoming[0]); // first one is next appointment
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch next appointment" });
  }
};
