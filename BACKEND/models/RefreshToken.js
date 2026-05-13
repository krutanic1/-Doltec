const mongoose = require('mongoose');
const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true },
  userAgent: { type: String },
  ip: { type: String },
  expiresAt: { type: Date, required: true, index: true },
  revoked: { type: Boolean, default: false },
}, { timestamps: true });

RefreshTokenSchema.index({ userId: 1, revoked: 1 });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
