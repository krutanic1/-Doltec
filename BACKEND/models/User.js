const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profile: { type: String, default: null },
  name: { type: String },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  jobLimit: { type: Number, default: 2 },
  password: { type: String },
  otp: { type: String },
  timestamp: { type: Date, default: Date.now },
  subscriptionPlan: { type: String, default: 'free' },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
  paid: { type: Boolean, default: false },
  accessLevel: { type: String, default: 'basic' },

});

const User = mongoose.model("User", userSchema);

module.exports = User;