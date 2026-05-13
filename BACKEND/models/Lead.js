const mongoose = require('mongoose');
const { Schema } = mongoose;

const LeadSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new','contacted','converted','closed'], default: 'new', index: true },
}, { timestamps: true });

LeadSchema.index({ propertyId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', LeadSchema);
