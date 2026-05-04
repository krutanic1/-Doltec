const express = require("express");
const router = express.Router();
const Createhr = require("../models/Createhr");
const Application = require("../models/Application");
const CompanyJobs =  require("../models/CompanyPostedJob");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//login hr
router.post("/hrlogin", async (req, res) => {
  try {
    const hr = await Createhr.findOne({ email: req.body.email });
    if (!hr) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (req.body.password !== hr.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
        const payload = {  user: { _id: hr._id }, role: "hr" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    res.status(200).json({
      message: "HR logged in successfully",
      hr: hr._id,
      email: hr.email,
      HrId: hr.HrId, 
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/checkauthgmail", async (req, res) => {
  const { email } = req.body;
  try {
    const hr = await Createhr.findOne({ email });

    if (!hr) {
      return res.status(401).json({ error: "user not found" });
    }
   
    const payload = {  user: { _id: hr._id }, role: "hr" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    res.status(200).json({
      message: "HR logged in successfully",
      hr: hr._id,
      email: hr.email,
      HrId: hr.HrId, 
      token,
    });
    
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/gethr/:hrId", async (req, res) => {
  try {
    const hr = await Createhr.find({HrId:req.params.hrId}).select("-password");
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }
    res.status(200).json(hr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// HR Dashboard Route
router.get("/hrdashboardcount/:hrId", async (req, res) => {
  try {
    const hrId = req.params.hrId;
    if (!hrId) {return res.status(400).json({ error: "hrId is required" });}
    const assignedApplications = await Application.find({ hrId });
    const assignedjobs =  await CompanyJobs.countDocuments({hrId});
    const jobIds = assignedApplications.map(app => app.jobId);
    const applicationreceived = new Set(jobIds.map(id => id.toString())).size;
    const shortListed = assignedApplications.filter(app => app.shortListed).length;
    const rejectedwhileinterview = assignedApplications.filter(app => app.interviewOverviewStatus === "Rejected").length;
    res.json({ applicationreceived, assignedjobs, shortListed,  rejectedwhileinterview});
  } catch (error) {
    console.error("Error in HR Dashboard Route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
