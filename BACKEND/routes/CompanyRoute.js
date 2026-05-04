const express = require("express");
const Company = require("../models/CompanyUser");
const router = express.Router();
const { sendEmail } = require("../controllers/MailController");
const CompanyPostedJob  = require("../models/CompanyPostedJob");
const cloudinary = require("../middleware/cloudinary")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require('crypto'); 


router.post('/company-signup', async (req, res) => {
  try {
    const { companyName, companyType, otherCompanyType, position, businessmodel, email, phone , password } = req.body;
 
    const existingCompany = await Company.findOne({ $or: [{ email }, { companyName }] });
    if (existingCompany) {
      return res.status(400).json({
        message: existingCompany.email === email ? 'Email already exists' : 'Company name already exists',
      });
    }
    const company = new Company({
      companyName,
      companyType,
      otherCompanyType: companyType === 'Other' ? otherCompanyType : '',
      position,
      businessmodel,
      email,
      phone,
      companyId: `comp${Date.now()}`, 
      password, 
    });
    await company.save();
    res.status(200).json({ message: 'Company registered successfully',   success: true, companyId: company.companyId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/company-login', async (req, res) => { 
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const company = await Company.findOne({ email: email.trim().toLowerCase() });
    if (!company) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (company.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const payload = { companyId: company.companyId, role: 'hr' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      success: true,
      companyId: company.companyId,
      name: company.companyName,
      email: company.email,
      subscriptionPlan: company.subscriptionPlan || null,
      accessLevel: company.accessLevel || 'basic',
      subscriptionEnd: company.subscriptionEnd || null,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//Send OTP to BDA Email
router.post("/companysendotp", async (req, res) => {
  const { email } = req.body;
  console.log("Received email for OTP:", email);
  try {
    const comapny = await Company.findOne({ email });
    console.log("company found:", comapny);
    if (!comapny) {
      return res.status(404).json({ message: "User not found" });
    }
     
    const otp = crypto.randomInt(100000, 1000000);
    console.log("Generated OTP:", otp);

      // Send OTP via Email
         const emailMessage = `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0D6EFD; color: #fff; text-align: center; padding: 20px;">
    <h1>Doltec</h1>
  </div>
  <div style="padding: 20px; text-align: center;">
    <p style="font-size: 16px; color: #333;">Welcome back, Recruiter!</p>
    <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for secure company account verification is:</p>
    <p style="font-size: 24px; font-weight: bold; color: #0D6EFD; margin: 10px 0;">${otp}</p>
    <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please keep it confidential and do not share it with anyone.</p>
  </div>
  <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
    <p>If you didn’t request this OTP, please ignore this email or contact the Doltec support team immediately.</p>
    <p>&copy; 2025 Doltec. All Rights Reserved.</p>
  </div>
</div>

      `;
      console.log("Email message constructed");
    comapny.otp = otp; 
    await Promise.all([
        comapny.save(),
        sendEmail({ email , subject : "Login Credentials" ,  message: emailMessage }),
    ]);
    res.status(200).json({ message: "OTP sent to your email!" });
    console.log("OTP sent successfully to:", email);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login
router.post("/companyverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("Verifying OTP for email:", email, "with OTP:", otp);
  try {
    const company = await Company.findOne({ email });
    console.log("Company found for OTP verification:", company);
    if (!company) {
      return res.status(404).json({ message: "user not found" });
    }
    if (company.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    console.log("OTP verified successfully for:", email);

    // Clear OTP after successful login
    company.otp = null;
    await company.save();

     console.log("OTP cleared after verification for:", email);

     const payload = { companyId: company.companyId, role: 'hr' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      success: true,
      companyId: company.companyId,
      name: company.companyName,
      email: company.email,
      subscriptionPlan: company.subscriptionPlan || null,
      accessLevel: company.accessLevel || 'basic',
      subscriptionEnd: company.subscriptionEnd || null,
      token,
    });

    console.log("Login successful, token generated for:", email);
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});


router.get("/allcompany", async (req, res) => {
  try {
    const jobs = await Company.find().select("-password -__v -companyLogoUrl").sort({ _id:-1}).lean();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching all companys:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/company-jobs", async (req, res) => {
  try {
    const { companyId } = req.query;
    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }
    const jobs = await CompanyPostedJob.find({ companyId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/company-jobs", async (req, res) => {
  try {
    const jobData = req.body;
    if (!jobData.companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    // Check if company has uploaded a logo
    const company = await Company.findOne({ companyId: jobData.companyId });
    if (!company || !company.companyLogoUrl) {
      return res.status(400).json({ message: "Please upload company logo before posting a job" });
    }

    const requiredFields = [
      "jobTitle","city" , "location", "jobType", "jobTiming", "workingDays",
      "jobDescription", "desiredSkills", "experience", "noofposition", "applicationDeadline"
    ];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }
    if (!jobData.salary || !jobData.salary.minSalary || !jobData.salary.maxSalary) {
      return res.status(400).json({ message: "Salary details are required" });
    }
    const newJob = new CompanyPostedJob(jobData);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("error in job:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/company-jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body;
    const updatedJob = await CompanyPostedJob.findByIdAndUpdate(id, jobData, {
      new: true,
      runValidators: true,
    });
    if (!updatedJob) {
      console.log(' Job not found');
      return res.status(404).json({ message: "Job not found" });
    }
    console.log(' Updated job=', updatedJob._id);
    res.status(200).json(updatedJob);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// fetchees company details for profile 
router.get('/company/:companyId', async (req, res) => {
  try {
    const company = await Company.findOne({ companyId: req.params.companyId });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// logo upload to cloudinary and update company logo url in db
router.post("/upload-logo/:companyId", async (req, res) => {
  try {
    const { image } = req.body;
    const { companyId } = req.params;
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }
    if (!companyId) {
      return res.status(400).json({ message: "No companyId provided" });
    }
    const result = await cloudinary.uploader.upload(image, {
      folder: "doltec_company_logo",
    });
    const company = await Company.findOneAndUpdate(
      { companyId: companyId }, 
      { companyLogoUrl: result.secure_url },
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Logo uploaded", companyLogoUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

router.post('/increment-job-limit', async (req, res) => {
  const { companyId } = req.body;

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  try {
    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Increment jobPostLimit by 1
    company.jobPostLimit += 1;
    await company.save();

    res.status(200).json({ message: 'Job post limit updated successfully', jobPostLimit: company.jobPostLimit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating job limit' });
  }
});

// Endpoint to fetch all companies (for jobPostLimit display)
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find({}, 'companyName companyId jobPostLimit');
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching companies' });
  }
});

// Endpoint to fetch company details by companyId
router.get('/company/:companyId', async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findOne({ companyId }, 'companyId jobPostLimit');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching company details' });
  }
});


// Endpoint to fetch company details by companyId
router.get('/company/profile/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({
      companyId: company.companyId,
      companyName: company.companyName,
      email: company.email,
      subscriptionPlan: company.subscriptionPlan || null,
      accessLevel: company.accessLevel || 'basic',
      subscriptionEnd: company.subscriptionEnd || null,
      jobPostLimit: company.jobPostLimit || 2, // Default to 2
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error while fetching company details' });
  }
});


module.exports = router;