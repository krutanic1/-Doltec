const mongoose = require('mongoose');

const ListingUpgradeHistorySchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fromTier: { type: String, enum: ['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'], required: true },
  toTier: { type: String, enum: ['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'], required: true },
  creditsDeducted: { type: Number, default: 0 },
  reason: { type: String, default: '' },
  effectiveAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

ListingUpgradeHistorySchema.index({ propertyId: 1, effectiveAt: -1 });

module.exports = mongoose.model('ListingUpgradeHistory', ListingUpgradeHistorySchema);
