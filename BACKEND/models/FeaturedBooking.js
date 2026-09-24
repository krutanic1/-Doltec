const mongoose = require('mongoose');

const FeaturedBookingSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  packageAssignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyPackageAssignment', default: null, index: true },
  slotType: { type: String, default: 'featured', index: true },
  startAt: { type: Date, required: true, index: true },
  endAt: { type: Date, required: true, index: true },
  placement: { type: String, default: 'homepage' },
  status: { type: String, enum: ['pending', 'booked', 'active', 'completed', 'cancelled', 'rejected'], default: 'pending', index: true },
  bookedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null, index: true },
  costSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null, index: true },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewNote: { type: String, default: '' },
}, { timestamps: true });

FeaturedBookingSchema.index({ orgId: 1, status: 1, startAt: -1 });

module.exports = mongoose.model('FeaturedBooking', FeaturedBookingSchema);