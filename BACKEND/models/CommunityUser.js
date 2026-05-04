const mongoose = require("mongoose");

const CommunityUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friendRequests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityUser" },
      name: { type: String },
    },
  ],
  friends: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityUser" },
      name: { type: String },
    },
  ],
  profile: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("CommunityUser", CommunityUserSchema);