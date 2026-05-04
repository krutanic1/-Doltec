const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  companyType: { type: String, required: true },
  otherCompanyType: { type: String },
  position: { type: String, required: true },
  businessmodel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, 
  otp: { type: String },
  companyId: { type: String, required: true, unique: true },
  jobPostLimit: { type: Number, default: 2 },
  companyLogoUrl: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  subscriptionPlan: { type: String, default: null },
  accessLevel: { type: String, default: 'basic' },
  subscriptionEnd: { type: Date, default: null },
});

module.exports = mongoose.model('CompanyUser', companySchema);