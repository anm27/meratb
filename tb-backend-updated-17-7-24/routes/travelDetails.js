const express = require("express");
const router = express.Router();
const {
  submitDetails,
  sendTravelRequest,
} = require("../controllers/travelController");
const authMiddleware = require("../middlewares/authMiddleware");
const TravelDetails = require("../models/TravelDetails");

router.post("/submitDetails", authMiddleware, submitDetails);
router.post("/sendTravelRequest", authMiddleware, sendTravelRequest);

// Add this route for fetching all users' travel details except the current user
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Fetch all users' travel details except the current user
    const allDetails = await TravelDetails.find({
      userId: { $ne: req.user.id },
    }).populate("userId", "username");

    res.json(allDetails);
  } catch (err) {
    console.error("Error fetching travel details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
