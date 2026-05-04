const express = require("express");
const cloudinary = require("../middleware/cloudinary");
const requireAdminAuth = require("../middleware/adminAuth");
const RealEstate = require("../models/RealEstate");

const router = express.Router();

const uploadSingleImage = (file) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "doltec_real_estate",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result.secure_url);
        }
      )
      .end(file.data);
  });

const extractPublicIdFromUrl = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const uploadIndex = pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return null;
    }

    let publicId = pathname.slice(uploadIndex + "/upload/".length);
    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^.\/]+$/, "");
    return publicId || null;
  } catch (error) {
    console.error("Failed to extract Cloudinary public id:", error.message);
    return null;
  }
};

router.post("/real-estate", requireAdminAuth, async (req, res) => {
  try {
    const { propertyName, location, locationLink, createdByAdminName, createdByAdminId } = req.body;

    if (!propertyName || !location || !locationLink) {
      return res.status(400).json({ message: "propertyName, location and locationLink are required" });
    }

    if (!req.files || !req.files.images) {
      return res.status(400).json({ message: "At least one property image is required" });
    }

    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    const hasInvalidFile = files.some((file) => !file.mimetype || !file.mimetype.startsWith("image/"));
    if (hasInvalidFile) {
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    const imageUrls = await Promise.all(files.map((file) => uploadSingleImage(file)));

    const property = new RealEstate({
      propertyName,
      location,
      locationLink,
      imageUrls,
      createdByAdminName: createdByAdminName || "Admin",
      createdByAdminId: createdByAdminId || "",
    });

    await property.save();

    return res.status(201).json({
      message: "Real estate property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error creating real estate property:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/real-estate", async (req, res) => {
  try {
    const requestedPage = parseInt(req.query.page || "1", 10);
    const requestedLimit = parseInt(req.query.limit || "0", 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 0;

    if (!limit) {
      const properties = await RealEstate.find().sort({ createdAt: -1 });
      return res.status(200).json(properties);
    }

    const totalCount = await RealEstate.countDocuments();
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const properties = await RealEstate.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      data: properties,
      totalCount,
      totalPages,
      currentPage: safePage,
      pageSize: limit,
    });
  } catch (error) {
    console.error("Error fetching real estate properties:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/real-estate/:id", requireAdminAuth, async (req, res) => {
  try {
    const { propertyName, location, locationLink } = req.body;
    const propertyId = req.params.id;

    const property = await RealEstate.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (propertyName) property.propertyName = propertyName;
    if (location) property.location = location;
    if (locationLink) property.locationLink = locationLink;

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const hasInvalidFile = files.some((file) => !file.mimetype || !file.mimetype.startsWith("image/"));
      if (hasInvalidFile) {
        return res.status(400).json({ message: "Only image files are allowed" });
      }
      const newImageUrls = await Promise.all(files.map((file) => uploadSingleImage(file)));
      property.imageUrls = [...property.imageUrls, ...newImageUrls];
    }

    await property.save();

    return res.status(200).json({
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error updating real estate property:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/real-estate/:id", requireAdminAuth, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await RealEstate.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const imagePublicIds = (property.imageUrls || [])
      .map(extractPublicIdFromUrl)
      .filter(Boolean);

    if (imagePublicIds.length > 0) {
      await Promise.allSettled(
        imagePublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId, { resource_type: "image" })
        )
      );
    }

    await RealEstate.findByIdAndDelete(propertyId);

    return res.status(200).json({
      message: "Property deleted successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error deleting real estate property:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
