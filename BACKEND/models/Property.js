const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  
  // Base fields for quick access
  city: { type: String, index: true },
  locality: { type: String, index: true },
  price: { type: Number, index: true },
  category: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL', 'PLOTS_LAND', 'PROJECTS', 'NEW_LAUNCH'], required: true },
  propertyType: { type: String, required: true },
  
  status: { type: String, enum: ['DRAFT', 'PENDING', 'APPROVED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'REJECTED', 'ARCHIVED'], default: 'DRAFT' },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Listings Module Additions
  tier: { type: String, enum: ['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'], default: 'PLAIN', index: true },
  expiresAt: { type: Date },
  metrics: {
    views: { type: Number, default: 0 },
    leads: { type: Number, default: 0 },
    shortlists: { type: Number, default: 0 }
  },
  
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
    mapUrl: String,
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
  reviewNote: String,
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PropertySchema.index({ orgId: 1, slug: 1 }, { unique: true });
PropertySchema.index({ orgId: 1, status: 1, createdAt: -1 });
PropertySchema.index({ 'filters.intent': 1, 'filters.segment': 1, 'filters.propertyType': 1 });

module.exports = mongoose.model('Property', PropertySchema);
