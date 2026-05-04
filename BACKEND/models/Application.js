const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },
  resume: {
  type: Object,
  required: true,
},

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyPostedJob",
    required: true,
  },
  hrId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  companyStatus: {
    type: String,
    default: "pending",
  },
  interviewOverviewStatus: {
    type: String,
    default: "pending",
  },
  shortListed: {
    type: Boolean,
    default: false,
  },
  interviews: [
    {
      round: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
      },
      mode: {
        type: String,
        enum: ["Online", "Offline", "Phone", "Not Specified"],
        default: "Not Specified",
      },
      link: {
        type: String,
      },
      interviewer: {
        type: String,
        default: "Not Assigned",
      },
      interviewStatus: {
        type: String,
        enum: ["Move to Next Round", "Rejected", "Cancelled", "Pending"],
        default: "Pending",
      },
      updateCandidate: {
        type: Boolean,
        default: false,
      },
      feedbackUpdatedByHR: {
        type: Boolean,
        default: false,
      },
    },
  ],
  offerLetter: {
    type: String,
    default: "Not Assigned",
  },
  updateHR: {
    type: Boolean,
    default: false,
  },
  interviewStatusUpdatedByHR: {
    type: Boolean,
    default: false,
  },
   offerLetterSent: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
});

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;