const mongoose = require('mongoose');
const { Schema } = mongoose;

const LeadSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  
  // Owner of the property
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Viewer/User details
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // for backward compatibility
  viewerUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  viewerName: { type: String },
  viewerEmail: { type: String },
  viewerPhone: { type: String },
  
  // Legacy / other fields
  name: { type: String }, // duplicate for backward compatibility
  email: { type: String },
  phone: { type: String },
  message: { type: String },
  
  // Pipeline status
  status: { 
    type: String, 
    enum: [
      'new', 'contacted', 'converted', 'closed',
      'NEW', 'CONTACT_VIEWED', 'ATTEMPTED_CALL', 'CONTACTED', 
      'FOLLOW_UP', 'QUALIFIED', 'SITE_VISIT', 'NEGOTIATION', 
      'CLOSED', 'LOST'
    ], 
    default: 'NEW', 
    index: true 
  },
  
  source: { type: String, default: 'property_contact_unlock', index: true },
  notes: { type: String },
  lastInteractionAt: { type: Date, default: Date.now },
  interactionCount: { type: Number, default: 1 },
  contactUnlockedAt: { type: Date, default: Date.now },
  
  assignedToUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  
  activities: [{
    type: { type: String },
    message: { type: String },
    byUser: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
  }],
  
  stageHistory: [{
    from: { type: String },
    to: { type: String },
    byUser: { type: Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

LeadSchema.index({ propertyId: 1, status: 1, createdAt: -1 });
LeadSchema.index({ orgId: 1, status: 1, createdAt: -1 });
LeadSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
LeadSchema.index({ viewerUserId: 1, propertyId: 1 }, { name: 'viewer_property_unique' });

module.exports = mongoose.model('Lead', LeadSchema);
