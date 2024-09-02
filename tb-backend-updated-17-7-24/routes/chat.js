// routes/chat.js
const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const MatchedUsers = require("../models/MatchedUsers");

// Save a message
router.post("/sendMessage", async (req, res) => {
  try {
    const { sender, recipient, message } = req.body;
    const newMessage = new ChatMessage({ sender, recipient, message });
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Get chat history
router.get("/history/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Get matched users
router.get("/matchedUsers/:userId", async (req, res) => {
  try {
    const matchedUsers = await MatchedUsers.find({
      userIds: req.params.userId,
    });
    res.status(200).json(matchedUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matched users" });
  }
});

module.exports = router;
