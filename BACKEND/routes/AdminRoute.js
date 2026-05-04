const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Company = require("../models/CompanyUser");
const Adminlogin = require("../models/Adminlogin");
const Createhr = require("../models/Createhr");
const ContactUs = require("../models/ContactUs");
const CompanyPostedJob = require("../models/CompanyPostedJob");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//login admin
router.post("/adminlogin", async (req, res) => {
  try {
    const adminlogin = await Adminlogin.findOne({ email: req.body.email });
    if (!adminlogin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (req.body.password !== adminlogin.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
        const payload = {  user: { _id: adminlogin._id }, role: "user" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res
      .status(200)
      .json({
        message: "Admin logged in successfully",
        adminId: adminlogin._id,
        email: adminlogin.email,
        name: adminlogin.name,
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//admin dashboard
router.get("/admindashboard", async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalHRs,
      postedJobs,
      assignedJobs,
      unassignedJobs,
    ] = await Promise.all([
      User.countDocuments(),
      Company.countDocuments(),
      Createhr.countDocuments(),
      CompanyPostedJob.countDocuments(),
      CompanyPostedJob.countDocuments({ assignedToHr: true }),
      CompanyPostedJob.countDocuments({ assignedToHr: false }),
    ]);
    res.status(200).json({
      totalUsers,
      totalCompanies,
      totalHRs,
      postedJobs,
      assignedJobs,
      unassignedJobs,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//create hr account
router.post("/createhr", async (req, res) => {
  try {
    const { name, email, number, password } = req.body;
    const hrId = `hr${Date.now()}`;

    const existingHr = await Createhr.findOne({ number: req.body.number });
    if (existingHr) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hr = new Createhr({
      name,
      email,
      number,
      password,
      HrId: hrId,
    });

    await hr.save();
    res.status(201).json({ message: "HR created successfully", HrId: hrId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//hr edit account
router.put("/edithr/:id", async (req, res) => {
  try {
    const { name, email, number, password } = req.body;
    const { id } = req.params;

    const updatedHr = await Createhr.findByIdAndUpdate(
      id,
      { name, email, number, password },
      { new: true }
    );

    if (!updatedHr) {
      return res.status(404).json({ message: "HR not found" });
    }

    res.status(200).json({ message: "HR updated successfully", data: updatedHr });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete hr account
router.delete("/deletehr/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHr = await Createhr.findByIdAndDelete(id);

    if (!deletedHr) {
      return res.status(404).json({ message: "HR not found" });
    }

    res.status(200).json({ message: "HR deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


//get hr account
router.get("/gethr", async (req, res) => {
  try {
    const hr = await Createhr.find().select("-password").sort({ _id: -1 }).lean();
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }
    res.status(200).json(hr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// contact us
router.post("/contactus", async (req, res) => {
  try {
    const newContactUs = new ContactUs(req.body);
    await newContactUs.save();
    res.status(200).json({ message: "Successfully Submited" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//get contact us
router.get("/getcontactus", async (req, res) => {
  try {
    const contact = await ContactUs.find().sort({ _id: -1 });
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// fetching all jobs with company name by performing  aggregate join operation
router.get("/company-all-jobs", async (req, res) => {
  try {
    const jobs = await CompanyPostedJob.aggregate([
      {
        $lookup: {
          from: "companyusers", // MongoDB collection name for CompanyUser
          localField: "companyId", // Field in CompanyPostedJob (string)
          foreignField: "companyId", // Field in CompanyUser (string)
          as: "company", // Output array field name
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          companyName: { $ifNull: ["$company.companyName", "Unknown Company"] },
          companyLogoUrl: { $ifNull: ["$company.companyLogoUrl", ""] },
          companyId: 1,
          jobTitle: 1,
          city: 1,
          location: 1,
          jobType: 1,
          jobTiming: 1,
          workingDays: 1,
          salary: 1,
          jobDescription: 1,
          desiredSkills: 1,
          experience: 1,
          noofposition: 1,
          applicationDeadline: 1,
          hrId: 1,
          assignedToHr: 1,
          hrName: 1,
          jobPostedOn: 1,
        },
      },
    ]).sort({ jobPostedOn: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// assign job to hr
router.post("/assign-to-hr", async (req, res) => {
  const { jobId, hrId, hrName } = req.body;
  try {
    if (!jobId || !hrId || hrName) {
      return res.status(400).json({ message: "jobId and hrId required" });
    }
    const hr = await Createhr.findOne({ HrId: hrId });
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }
    const job = await CompanyPostedJob.findByIdAndUpdate(
      jobId,
      { hrId, hrName: hr.name, assignedToHr: true },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job assigned", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/company/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Fields you want to update
    const {
      companyName,
      email,
      phone,
      companyType,
      otherCompanyType,
      position,
      businessmodel,
      jobPostLimit,
    } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      {
        companyName,
        email,
        phone,
        companyType,
        otherCompanyType,
        position,
        businessmodel,
        jobPostLimit,
      },
      { new: true }
    );

    if (!updatedCompany)
      return res.status(404).json({ message: 'Company not found' });

    res.json({ message: 'Company updated successfully', data: updatedCompany });
  } catch (err) {
    res.status(500).json({ message: 'Error updating company', error: err.message });
  }
});

module.exports = router;
