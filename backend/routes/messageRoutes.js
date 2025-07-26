const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ GET messages by room
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId }).sort(
      "createdAt"
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ POST new message
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, room, message, time } = req.body;

    const newMessage = new Message({
      sender,
      receiver,
      room,
      message,
      time,
      status: "sent",
    });

    const saved = await newMessage.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
