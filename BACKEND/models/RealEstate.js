const mongoose = require("mongoose");

const realEstateSchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationLink: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    createdByAdminName: {
      type: String,
      default: "Admin",
      trim: true,
    },
    createdByAdminId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RealEstate", realEstateSchema);
