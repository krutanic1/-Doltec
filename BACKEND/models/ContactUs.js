const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name:{ type: String},
  phone: { type: String},
  email: { type: String},
  message: { type: String},
  timestamp: { type: Date, default: Date.now },
});

const ContactUs = mongoose.model("contactus", contactSchema);

module.exports = ContactUs;