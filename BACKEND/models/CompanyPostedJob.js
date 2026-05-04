const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  city:{ type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  jobTiming: { type: String, required: true },
  workingDays: { type: String, required: true },
  salary: {
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    per: { type: String, default: "Year" },
  },
  jobDescription: { type: String, required: true },
  desiredSkills: { type: String, required: true },
  experience: { type: String, required: true },
  noofposition: { type: Number, required: true },
  applicationDeadline: { type: String, required: true },
  companyId: { type: String, required: true },
  hrId: { type: String, default: null }, 
  hrName: { type: String, default: null },
  assignedToHr: { type: Boolean, default: false },
  jobPostedOn: { type: Date, default: Date.now },

});

const CompanyPostedJob = mongoose.model("CompanyPostedJob", jobSchema);

module.exports = CompanyPostedJob;