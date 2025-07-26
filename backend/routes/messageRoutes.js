const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ GET messages by room
// router.get("/:roomId", async (req, res) => {
//   try {
//     const messages = await Message.find({ room: req.params.roomId }).sort(
//       "createdAt"
//     );
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });
router.get("/:roomId", async (req, res) => {
  try {
    const userId = req.query.userId; // ⬅️ pass userId as query param from frontend

    const messages = await Message.find({
      room: req.params.roomId,
      deletedBy: { $ne: userId }, // ⬅️ exclude messages deleted by this user
    }).sort("createdAt");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
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

//Delete for Me:
router.put("/delete-for-me/:id", async (req, res) => {
  try {
    const { userId } = req.body; // current user
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ error: "Message not found" });

    // add user to deletedBy array if not already there
    if (!message.deletedBy.includes(userId)) {
      message.deletedBy.push(userId);
      await message.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//Delete for Everyone:
router.put("/delete-for-everyone/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ error: "Message not found" });

    message.message = "This message was deleted";
    message.isDeleted = true;
    await message.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
