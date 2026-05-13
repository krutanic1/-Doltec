const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  intent: { type: String, enum: ['BUY', 'RENT'], required: true },
  segment: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL'], required: true },
  status: { type: String, enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'], default: 'DRAFT' },
  
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  location: {
    addressLine1: String,
    locality: String,
    city: { type: String, index: true },
    state: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  pricing: {
    amount: { type: Number, index: true },
    currency: { type: String, default: 'INR' },
    isNegotiable: { type: Boolean, default: false }
  },
  
  features: {
    bhk: Number,
    bathrooms: Number,
    areaSqFt: Number,
    furnishing: String,
    floorNo: Number,
    totalFloors: Number
  },
  
  amenities: [String],
  media: [{ url: String, publicId: String, isHero: Boolean }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);
