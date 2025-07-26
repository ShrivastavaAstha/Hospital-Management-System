const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const Message = require("./models/Message.js");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://medcare-nine-alpha.vercel.app",
  "https://medcare-ndkbme5xo-shrivastavaasthas-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

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
app.use("/api/messages", require("./routes/messageRoutes")); // ✅ Add this route

app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running");
});

// Socket Logic
const userSocketMap = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("register_user", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log("✅ User registered:", userId);
  });

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`🛏️ Joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const savedMsg = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        room: data.room,
        message: data.message,
        time: data.time,
        status: "sent",
      });

      io.to(data.room).emit("receive_message", savedMsg);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("message_delivered", async ({ room, messageId }) => {
    try {
      // Optional: update DB
      await Message.findByIdAndUpdate(messageId, { status: "delivered" });

      io.to(room).emit("message_delivered", { messageId });
    } catch (err) {
      console.error("❌ Error marking delivered:", err);
    }
  });

  socket.on("mark_seen", async ({ room, messageId, sender }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: "seen" });

      // Send to all users in room
      io.to(room).emit("message_seen", { messageId });

      // Also send directly to sender if online
      const senderSocket = userSocketMap.get(sender);
      if (senderSocket) {
        io.to(senderSocket).emit("message_seen", { messageId });
      }
    } catch (err) {
      console.error("❌ Error marking seen:", err);
    }
  });

  socket.on("typing", ({ room }) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop_typing", ({ room }) => {
    socket.to(room).emit("stop_typing");
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
