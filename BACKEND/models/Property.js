const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  
  // Base fields for quick access
  city: { type: String, index: true },
  locality: { type: String, index: true },
  price: { type: Number, index: true },
  category: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL', 'PLOTS_LAND', 'PROJECTS', 'NEW_LAUNCH'], required: true },
  propertyType: { type: String, required: true },
  
  status: { type: String, enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'], default: 'DRAFT' },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Structured Filters for Buyer Search
  filters: {
    intent: { type: String, enum: ['BUY', 'RENT'], index: true },
    segment: { type: String, index: true },
    propertyType: { type: String, index: true },
    bhk: { type: String, index: true },
    possession: { type: String, index: true },
    readyToMove: { type: Boolean, default: false, index: true },
    age: { type: String, index: true },
    postedBy: { type: String, index: true },
    amenities: { type: [String], index: true },
    furnishing: { type: String, index: true },
    facing: { type: String, index: true },
    parking: { type: String, index: true },
    availability: { type: String, index: true }
  },

  location: {
    addressLine1: String,
    locality: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  pricing: {
    amount: { type: Number },
    currency: { type: String, default: 'INR' },
    isNegotiable: { type: Boolean, default: false }
  },
  
  features: {
    bhk: String,
    bathrooms: Number,
    areaSqFt: Number,
    floorNo: Number,
    totalFloors: Number
  },
  
  media: [{ url: String, publicId: String, isHero: Boolean }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PropertySchema.index({ 'filters.intent': 1, 'filters.segment': 1, 'filters.propertyType': 1 });

module.exports = mongoose.model('Property', PropertySchema);
