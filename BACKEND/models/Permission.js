const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  resource: { type: String, required: true, index: true },
  action: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'general', index: true },
  isSystem: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

PermissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);