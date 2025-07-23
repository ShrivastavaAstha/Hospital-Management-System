const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");

// Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();
    const totalBills = await Bill.countDocuments();

    // Total Revenue
    const bills = await Bill.find();
    const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

    // Appointments per day (for line chart)
    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$appointmentDate", // 👈 just use string field directly
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue per day (for bar chart)
    const revenueStats = await Bill.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      totalDoctors,
      totalAppointments,
      totalBills,
      totalRevenue,
      appointmentStats,
      revenueStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Example: controllers/doctorController.js
exports.deleteDoctor = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate("patientId", "name")
      .populate("doctorId", "name");
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("patientId", "name");
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete bill" });
  }
};
