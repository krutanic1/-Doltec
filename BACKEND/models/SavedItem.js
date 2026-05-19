const mongoose = require('mongoose');

const SavedItemSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemType: { type: String, enum: ['property', 'lead', 'inquiry', 'campaign'], required: true, index: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  notes: { type: String, default: '' },
  tags: { type: [String], default: [] },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  source: { type: String, default: 'workspace' },
  savedAt: { type: Date, default: Date.now, index: true },
  removedAt: { type: Date, default: null, index: true },
  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

SavedItemSchema.index({ orgId: 1, userId: 1, itemType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('SavedItem', SavedItemSchema);