const mongoose = require('mongoose');
const { Schema } = mongoose;

const SavedPropertySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
}, { timestamps: true });

SavedPropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('SavedProperty', SavedPropertySchema);
