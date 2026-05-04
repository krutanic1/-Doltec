
require("dotenv").config();
const nodemailer = require("nodemailer");

const smtpHost = (process.env.SMTP_HOST || "").trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = (process.env.SMTP_MAIL || "").trim();
const smtpPass = (process.env.SMTP_PASSWORD || "").replace(/\s+/g, "");

let transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed: check SMTP_MAIL/SMTP_PASSWORD (Gmail App Password)");
  } else {
    console.log("SMTP Server Ready to Send Mail!");
  }
});



const sendEmail = async ({ email, subject, message }) => {
  const mailOptions = {
    from: smtpUser,
    to: email,
    // cc: process.env.SMTP_ADMIN_MAIL,
    subject: subject,
    html: message,
    priority: "high",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };