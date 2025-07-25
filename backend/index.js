// socket-enabled-server.js or index.js
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const Message = require("./models/Message.js");

const app = express();
const server = http.createServer(app); // ⬅️ Create HTTP server (required for Socket.IO)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 🔁 your React app's port
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/patients", require("./routes/patientRoute"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/billing", require("./routes/billingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
// Root Route
app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running");
});

// ⚡️ Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    const newMsg = await Message.create({
      senderId: data.sender,
      receiverId: data.receiver,
      message: data.message,
    });
    io.to(data.room).emit("receive_message", {
      ...data,
      _id: newMsg._id,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// Start server with Socket.IO support
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
