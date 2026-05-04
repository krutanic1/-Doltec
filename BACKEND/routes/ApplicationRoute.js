const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const CompanyUser = require("../models/CompanyUser");
const CompanyPostedJob = require("../models/CompanyPostedJob");
const Resume = require("../models/Resume");
const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// user apply job
router.post("/apply-job", async (req, res) => {
  const { userId, resumeId, jobId, status = "pending" } = req.body;
  try {
    if (await Application.findOne({ userId, jobId })) {
      return res.status(400).json({ message: "Application already exists" });
    }
    const job = await CompanyPostedJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const application = await Application.create({
      userId,
      resumeId,
      resume: resume.toObject(),
      jobId,
      hrId: job.hrId,
      status,
    });
    const data = await Application.findById(application._id)
      .populate("userId")
      .populate("jobId");
    const company = await CompanyUser.findOne({
      companyId: data.jobId.companyId,
    });
    res.status(201).json({
      ...data._doc,
      jobId: {
        ...data.jobId._doc,
        company: company
          ? {
              companyName: company.companyName || "Unknown Company",
              companyLogoUrl: company.companyLogoUrl || "",
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// checking if user has applied for a job
router.get("/user-applications", async (req, res) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      return res
        .status(403)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user._id;
    const applications = await Application.find({
      userId: new mongoose.Types.ObjectId(userId),
    });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
//showing applied jobs to user
router.get("/appliedjobs", async (req, res) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      return res
        .status(403)
        .json({ error: "Access denied. No token provided." });}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user._id;
    const applications = await Application.find({ userId })
      .populate("jobId", "jobTitle location ")
      .select("-hrId  -resumeId");
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// hr get all applications
router.get("/hr-applications/:hrId", async (req, res) => {
  try {
    const applications = await Application.find({ hrId: req.params.hrId })
      .populate({
        path: "jobId",
        select: "companyName jobTitle desiredSkills hrId hrName companyId jobDescription",})
      .populate({ path: "userId", select: "fullname phone email" })
      .populate("resumeId");
    const response = await Promise.all(
      applications.map(async (app) => {
        const company = await CompanyUser.findOne({
          companyId: app.jobId.companyId,
        });
        return {
          ...app._doc,
          jobId: {
            ...app.jobId._doc,
            company: company
              ? {
                  companyName: company.companyName || "Unknown Company",
                  companyLogoUrl: company.companyLogoUrl || "",
                }
              : { companyName: app.jobId.companyName, companyLogoUrl: "" },
          },
        };
      })
    );
    res.json(response);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// hr get all applications for a specific job and updating status
router.put("/application/:applicationId/status", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status: req.body.status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// company get all applications for a specific job
router.get("/selected-applications/:companyId", async (req, res) => {
  try {
    const applications = await Application.find({ status: "selected" })
      .populate({
        path: "jobId",
        match: { companyId: req.params.companyId },
        select: "jobTitle companyId hrId hrName",
      })
      .populate("resumeId")
      .populate({ path: "userId", select: "name" });
    res.json(applications.filter((app) => app.jobId));
  } catch (error) {
    console.error("Error fetching selected applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// company udpates interview overview status and shortlisted
router.put("/application/:applicationId/companyStatus", async (req, res) => {
  try {
    const { status, shortListed } = req.body;
    const updateData = {};
    if (status) {
      updateData.companyStatus = status;
    }
    if (typeof shortListed === "boolean") {
      updateData.shortListed = shortListed;
    }
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { $set: updateData },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    console.error("Error updating application status or shortlisted:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.put(
  "/interview-application/:applicationId/companyStatus",
  async (req, res) => {
    try {
      const { status } = req.body;
      const updateData = {};
      if (status) {
        updateData.interviewOverviewStatus = status;
      }

      const application = await Application.findByIdAndUpdate(
        req.params.applicationId,
        { $set: updateData }
      );
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error updating overview stat:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
// showing shortlisted applications in company dashboard
router.get("/shortlisted-applications/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const applications = await Application.find({
      shortListed: true,
    })
      .populate({
        path: "jobId",
        match: { companyId: companyId },
        select: "jobTitle companyId",
      })
      .populate("resumeId", "personalInfo.name")
      .populate("userId", "name");
    const filteredApplications = applications.filter((app) => app.jobId);
    const enrichedApplications = await Promise.all(
      filteredApplications.map(async (application) => {
        const company = await CompanyUser.findOne({
          companyId: application.jobId.companyId,
        });
        return {
          ...application._doc,
          jobId: {
            ...application.jobId._doc,
            company: company
              ? { companyName: company.companyName || "N/A" }
              : { companyName: "N/A" },
          },
        };
      })
    );

    res.json(enrichedApplications);
  } catch (error) {
    console.error("Error fetching shortlisted applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// all rejected applications in hr  dashboard
router.get("/rejected-applications/:hrId", async (req, res) => {
  try {
    const { hrId } = req.params;

    // Validate hrId
    if (!hrId) {
      return res.status(400).json({ error: "HR ID is required" });
    }

    // Fetch applications with any rejection status
    const applications = await Application.find({
      $or: [
        { status: "rejected", hrId },
        { companyStatus: "Rejected", hrId },
        { interviewOverviewStatus: "Rejected", hrId },
      ],
    })
      .populate({
        path: "jobId",
        select: "jobTitle companyId desiredSkills jobDescription",
      })
      .populate("resumeId")
      .populate({ path: "userId", select: "name" })
      .lean(); // Use lean() for performance (converts Mongoose docs to plain JS objects)

    // Enrich applications with company details
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const company = await CompanyUser.findOne({
          companyId: app.jobId?.companyId,
        }).lean();
        return {
          ...app,
          jobId: {
            ...app.jobId,
            company: company
              ? { companyName: company.companyName || "N/A" }
              : { companyName: "N/A" },
          },
        };
      })
    );

    res.json(enrichedApplications);
  } catch (error) {
    console.error("Error fetching rejected applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// showing interview applications in company dashboard
router.get("/interview-applications/:companyId", async (req, res) => {
  try {
    const applications = await Application.find({
      companyStatus: "Selected",
      jobId: {
        $in: await CompanyPostedJob.find({
          companyId: req.params.companyId,
        }).distinct("_id"),
      },
    })
      .populate("userId", "name")
      .populate("resumeId")
      .populate("jobId", "jobTitle hrName");
    res.json(applications);
  } catch (error) {
    console.error("Error fetching interview applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// adding interview schedule
router.put("/company-application/:applicationId/interview",async (req, res) => {
    try {
      const { date, mode, link, interviewer, interviewStatus } = req.body;
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      const roundNumber = (application.interviews?.length || 0) + 1;
      application.interviews.push({
        round: roundNumber,
        date,
        mode,
        link,
        interviewer,
        interviewStatus,
      });
      await application.save();
      res.json(application);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
// adding feedback for interview
router.put("/company-application/:applicationId/interview/:interviewId/feedback", async (req, res) => {
    try {
      const { interviewStatus } = req.body;
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      const interview = application.interviews.id(req.params.interviewId);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      interview.interviewStatus = interviewStatus;
      await application.save();
      res.json(application);
    } catch (error) {
      console.error("Error updating interview status:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
// routes/application.js
router.get("/hr-applications/:hrId", async (req, res) => {
  try {
    const hrId = req.params.hrId;

    const applications = await Application.find({
      jobId: { $in: jobIds },
      interviews: { $exists: true, $ne: [] },
    })
      .populate("jobId")
      .populate("resumeId")
      .populate("userId");

    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications with interviews found" });
    }

    res.json(applications);
  } catch (error) {
    console.error("Error fetching HR applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// offer letter upload from company dashboard
router.post("/upload-offer-letter", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { applicationId } = req.body;
    if (!applicationId) {
      return res.status(400).json({ message: "applicationId is required" });
    }
    const file = req.files.file;
    const result = await cloudinary.uploader
      .upload_stream(
        {
          folder: "doltec_offer_letter",
          resource_type: "auto",
        },
        async (error, result) => {
          if (error) {
            throw new Error("Cloudinary upload failed: " + error.message);
          }
          const application = await Application.findByIdAndUpdate(
            applicationId,
            { offerLetter: result.secure_url },
            { new: true }
          );
          if (!application) {
            return res.status(404).json({ message: "Application not found" });
          }
          res.json({
            message: "Offer letter uploaded",
            offerLetter: result.secure_url,
          });
        }
      )
      .end(file.data);
  } catch (error) {
    console.error("Error uploading offer letter:", error);
    res
      .status(500)
      .json({ message: "Error uploading offer letter", error: error.message });
  }
});
// fetching offer letter
router.get("/offer-letter/:applicationId", async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.json({ offerLetter: application.offerLetter });
  } catch (error) {
    console.error("Error fetching offer letter:", error);
    res
      .status(500)
      .json({ message: "Error fetching offer letter", error: error.message });
  }
});
// sending offer letter to hr
router.post("/update-to-hr", async (req, res) => {
  try {
    const { applicationId } = req.body;
    if (!applicationId) {
      return res.status(400).json({ message: "applicationId is required" });
    }
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        shortListed: "true",
        updateHR: true,
      },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res
      .status(200)
      .json({ message: "Updated to HR successfully", application });
  } catch (error) {
    console.error("Error updating to HR:", error);
    res
      .status(500)
      .json({ message: "Error updating to HR", error: error.message });
  }
});
// receiving offer letter from company dashboard to hr dashboard
router.get("/hired-applications/:HrId", async (req, res) => {
  try {
    const applications = await Application.find({
      updateHR: true,
    })
      .populate({
        path: "jobId",
        match: { hrId: req.params.HrId },
        select: "jobTitle hrId companyId",
      })
      .populate("resumeId")
      .populate({ path: "userId", select: "name" });
    const enrichedApplications = await Promise.all(
      applications
        .filter((app) => app.jobId)
        .map(async (app) => {
          const company = await CompanyUser.findOne({
            companyId: app.jobId.companyId,
          });
          return {
            ...app._doc,
            jobId: {
              ...app.jobId._doc,
              companyId: company
                ? { companyName: company.companyName || "N/A" }
                : { companyName: "N/A" },
            },
          };
        })
    );

    res.json(enrichedApplications);
  } catch (error) {
    console.error("Error fetching hired applications:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// to update the interview round from hr to user
router.put(
  "/application/:applicationId/interview/:round/update-candidate",
  async (req, res) => {
    try {
      const { applicationId, round } = req.params;
      const { updateCandidate } = req.body;
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
      if (typeof updateCandidate !== "boolean") {
        return res
          .status(400)
          .json({ message: "updateCandidate must be a boolean" });
      }
      const application = await Application.findOneAndUpdate(
        { _id: applicationId, "interviews.round": parseInt(round) },
        { $set: { "interviews.$.updateCandidate": updateCandidate } },
        { new: true }
      );

      if (!application) {
        return res
          .status(404)
          .json({ message: "Application or interview round not found" });
      }

      res
        .status(200)
        .json({
          message: "Candidate status updated successfully",
          application,
        });
    } catch (error) {
      console.error("Error updating candidate status:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Route for fetching user interviews
router.get("/user-interviews", async (req, res) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      return res
        .status(403)
        .json({ error: "Access denied. No token provided." });}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user._id;
    // const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const applications = await Application.find(
      { userId },
      {
        jobId: 1,
        status: 1,
        companyStatus: 1,
        interviews: 1,
        interviewOverviewStatus: 1,
        shortListed: 1,
        interviewStatusUpdatedByHR: 1,
        offerLetter: 1,
        offerLetterSent: 1,
      }
    )
      .populate("jobId", "jobTitle location company")
      .lean();
    const filteredApplications = applications
      .map((app) => {
        const filteredInterviews = app.interviews.filter(
          (interview) => interview.updateCandidate === true
        );
        if (filteredInterviews.length > 0) {
          return {
            applicationId: app._id,
            jobTitle: app.jobId?.jobTitle || "Unknown",
            location: app.jobId?.location || "Unknown",
            companyName: app.jobId?.company?.companyName || "Unknown",
            status: app.status || "Pending",
            companyStatus: app.companyStatus || "Pending",
            interviewOverviewStatus: app.interviewOverviewStatus || "Pending",
            shortListed: app.shortListed || false,
            interviewStatusUpdatedByHR: app.interviewStatusUpdatedByHR || false,
            offerLetter: app.offerLetter || "Not Assigned",
            offerLetterSent: app.offerLetterSent || false,
            interviews: filteredInterviews.map((interview) => ({
              round: interview.round,
              date: interview.date,
              mode: interview.mode,
              link: interview.link,
              interviewer: interview.interviewer,
              interviewStatus: interview.feedbackUpdatedByHR
                ? interview.interviewStatus
                : null,
              updateCandidate: interview.updateCandidate,
              feedbackUpdatedByHR: interview.feedbackUpdatedByHR,
            })),
          };
        }
        return null;
      })
      .filter((app) => app !== null);
    res
      .status(200)
      .json(
        filteredApplications.length > 0
          ? filteredApplications
          : {
              message: "No interviews found with updateCandidate: true",
              interviews: [],
            }
      );
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Route for updating interview feedback
router.put(
  "/application/:applicationId/interview/:round/update-feedback",
  async (req, res) => {
    try {
      const { applicationId, round } = req.params;
      const { feedback, feedbackUpdatedByHR } = req.body;

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
      if (!feedback) {
        return res.status(400).json({ message: "Feedback is required" });
      }

      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const interview = application.interviews.find(
        (int) => int.round === parseInt(round)
      );
      if (!interview) {
        return res.status(404).json({ message: "Interview round not found" });
      }
      interview.interviewStatus = feedback;
      interview.feedbackUpdatedByHR = feedbackUpdatedByHR || true;
      await application.save();

      res.status(200).json({ message: "Feedback updated successfully" });
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Route for updating interview status
router.put(
  "/application/:applicationId/update-interview-status",
  async (req, res) => {
    try {
      const { applicationId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      application.interviewStatusUpdatedByHR = true;
      await application.save();

      res
        .status(200)
        .json({ message: "Interview status updated successfully" });
    } catch (error) {
      console.error("Error updating interview status:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Route for sending offer letter
router.put(
  "/application/:applicationId/send-offer-letter",
  async (req, res) => {
    try {
      const { applicationId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      console.log("Sending offer letter for:", applicationId, {
        before: {
          offerLetterSent: application.offerLetterSent,
          offerLetter: application.offerLetter,
        },
      });
      application.offerLetterSent = true;
      await application.save();

      res.status(200).json({ message: "Offer letter sent successfully" });
    } catch (error) {
      console.error("Error sending offer letter:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
