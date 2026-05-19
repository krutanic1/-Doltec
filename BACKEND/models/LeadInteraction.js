const mongoose = require('mongoose');
const { Schema } = mongoose;

const LeadInteractionSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  viewerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, default: 'UNLOCK_VIEW', index: true },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' }
}, { timestamps: true });

LeadInteractionSchema.index({ leadId: 1, createdAt: -1 });

module.exports = mongoose.model('LeadInteraction', LeadInteractionSchema);
