const TravelDetails = require("../models/TravelDetails");
const User = require("../models/User");

exports.submitDetails = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, timeSlot, phone } = req.body;
    const newDetails = new TravelDetails({
      userId: req.user.id,
      pickupLocation,
      dropLocation,
      timeSlot,
      phone,
    });
    await newDetails.save();

    // Find matches for the current user excluding their own details
    const matches = await TravelDetails.find({
      pickupLocation: newDetails.pickupLocation,
      dropLocation: newDetails.dropLocation,
      // time: { $gte: newDetails.time - 30 * 60000, $lte: newDetails.time + 30 * 60000 }
      timeSlot: newDetails.timeSlot,
    }).populate("userId", "username");

    console.log("All matches before filtering:", matches);

    // Emit the matches to the current user excluding themselves
    const currentUserMatches = matches.filter(
      (match) => match.userId._id.toString() !== req.user.id
    );
    console.log("Matches for current user:", currentUserMatches);
    req.io.to(req.user.id).emit("newMatch", currentUserMatches);

    // Emit the matches for other users
    matches.forEach((match) => {
      if (match.userId._id.toString() !== req.user.id) {
        const userMatches = matches.filter(
          (m) => m.userId._id.toString() !== match.userId._id.toString()
        );
        console.log(
          `Emitting matches to user ${match.userId._id}:`,
          userMatches
        );
        req.io.to(match.userId._id.toString()).emit("newMatch", userMatches);
      }
    });

    res.status(201).json({ msg: "Travel details submitted" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
};

exports.sendTravelRequest = (req, res) => {
  const { recipientId, pickupLocation, dropLocation } = req.body;
  const senderId = req.user.id;

  console.log(`Sending travel request from ${senderId} to ${recipientId}`);
  req.io.to(recipientId).emit("receiveTravelRequest", {
    senderId,
    pickupLocation: req.body.pickupLocation,
    dropLocation: req.body.dropLocation,
  });

  res.status(200).json({ msg: "Travel request sent" });
};
