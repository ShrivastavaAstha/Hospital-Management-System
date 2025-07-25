const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// require("dotenv").config();

const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // Routes
// const patientRoute = require("./routes/patientRoute");
// app.use("/api/patients", patientRoute);

// const doctorRoutes = require("./routes/doctorRoutes");
// app.use("/api/doctors", doctorRoutes);

// app.use("/uploads", express.static("uploads")); // to serve image

// app.use("/api/doctors", doctorRoutes);

// const appointmentRoutes = require("./routes/appointmentRoutes");
// app.use("/api/appointments", appointmentRoutes);

// const billingRoutes = require("./routes/billingRoutes");
// app.use("/api/billing", billingRoutes);

// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);

// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// const paymentRoutes = require("./routes/paymentRoutes");
// app.use("/api/payment", paymentRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running");
});

// const PORT = process.env.PORT || 5000;

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// app.use(express.static("client/build"));
// app.get("*", (req, res) => {
//   res.sendFile(
//     path.resolve(__dirname + "/client/build/index.html"),
//     function (err) {
//       if (err) {
//         console.log(err);
//       }
//     }
//   );
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
