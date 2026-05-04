const Razorpay = require("razorpay");
require("dotenv").config();

exports.razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  RAZORPAY_WEBHOOK_SECRET1: process.env.RAZORPAY_WEBHOOK_SECRET_COMPANY,
});

