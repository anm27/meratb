const mongoose = require("mongoose");

const matchedUsersSchema = new mongoose.Schema({
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  matchedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MatchedUsers", matchedUsersSchema);
