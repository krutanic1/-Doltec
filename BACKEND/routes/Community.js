const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const CommunityUser = require ("../models/CommunityUser")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("../middleware/cloudinary");

// Community User Signup
router.post("/community-signup", async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // Check if email already exists
        const existingUser = await CommunityUser.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const communityUser = new CommunityUser({
            name,
            email: email.trim().toLowerCase(),
            password,
            confirmPassword,
            phone: phone || undefined 
        });

        await communityUser.save();
        res.status(201).json({ message: "User registered successfully", success: true });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});
// Community User Login
router.post("/community-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide email and password" 
            });
        }

        if (!CommunityUser) {
            throw new Error("CommunityUser model is not defined");
        }

        const communityUser = await CommunityUser.findOne({ 
            email: email.trim().toLowerCase() 
        });
        
        if (!communityUser) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        if (communityUser.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Return user data directly - NO TOKEN
        res.status(200).json({
            success: true,
            userId: communityUser._id,
            name: communityUser.name,
            email: communityUser.email,
            profile: communityUser.profile,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false, 
            message: `Server error: ${err.message || "Please try again later"}` 
        });
    }
});

router.post("/checkauthcommunitygmail", auth, async (req, res) => {
    console.log("Received request to /checkauthgmail");
  const { email } = req.body;
  console.log("Received email for auth check:", email);
  try {
    const communityUser = await CommunityUser.findOne({ email });

    if (!communityUser) {
      return res.status(401).json({ error: "user not found" });
    }
   
      res.status(200).json({success: true, userId: communityUser._id,name: communityUser.name, email: communityUser.email, profile: communityUser.profile  });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all Community Users
router.get("/getcommunityuser/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const communityUser = await CommunityUser.findById(userId).select("name email");
        if (!communityUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: communityUser._id,
                name: communityUser.name,
                email: communityUser.email,
            },
        });
    } catch (err) {
        console.error("Fetch user error:", err);
        res.status(500).json({ success: false, message: `Server error: ${err.message || "Please try again later"}` });
    }
});

//upload profile photo
router.post("/communityprofile", auth, async (req, res) => {
  try {
    const { image , userId } = req.body;
    console.log("Received image for upload:", !!image);
    console.log("Received userId for upload:", userId);
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }
    const result = await cloudinary.uploader.upload(image, {
      folder: "doltec__community_user__profile",
    });
    const user = await CommunityUser.findByIdAndUpdate(
      userId,
      { profile: result.secure_url },
      { new: true }
    );
    res.json({ message: "Profile photo uploaded", user });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Error uploading image", error });
  }
});
module.exports = router;