const mongoose = require('mongoose');
const { Schema } = mongoose;

const PropertyViewSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  ip: { type: String, default: null, index: true },
  userAgent: { type: String, default: '' },
  fingerprint: { type: String, index: true }
}, { timestamps: true });

// Ensure a user can only view a property ONCE for all time.
PropertyViewSchema.index({ propertyId: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } });

// Ensure an IP can only view a property ONCE per a certain timeframe, or forever.
PropertyViewSchema.index({ propertyId: 1, ip: 1 }, { unique: true, partialFilterExpression: { ip: { $type: "string", $ne: "" } } });

// For browser fingerprint
PropertyViewSchema.index({ propertyId: 1, fingerprint: 1 }, { unique: true, partialFilterExpression: { fingerprint: { $type: "string", $ne: "" } } });

module.exports = mongoose.model('PropertyView', PropertyViewSchema);
