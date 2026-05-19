const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  profile: { type: String, default: null },
  name: { type: String },
  phone: { type: String, sparse: true },        // optional on sign-up; sparse so missing/null values don't collide
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, default: null },
  jobLimit: { type: Number, default: 2 },
  password: { type: String },
  otp: { type: String },
  timestamp: { type: Date, default: Date.now },
  subscriptionPlan: { type: String, default: 'free' },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
  paid: { type: Boolean, default: false },
  accessLevel: { type: String, default: 'basic' },
  role: { type: String, enum: ['USER', 'OWNER', 'AGENT', 'BUILDER', 'ADMIN'], default: 'USER' },
  posterType: { type: String, enum: ['OWNER', 'AGENT', 'BUILDER'], default: 'OWNER' },
  status: { type: String, enum: ['active', 'blocked', 'pending', 'disabled'], default: 'active', index: true },
  authProvider: { type: String, default: 'local' },
  googleId: { type: String },                   // no default — local users leave this field absent, not null
  emailVerified: { type: Boolean, default: false },
  tokenVersion: { type: Number, default: 0 },
  refreshTokenVersion: { type: Number, default: 0 },
  lastLoginAt: { type: Date, default: null, index: true },
  mfaEnabled: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

});

userSchema.index({ orgId: 1, email: 1 });
userSchema.index({ orgId: 1, phone: 1 });
userSchema.index({ orgId: 1, role: 1, status: 1 });
// Sparse unique index: only indexes documents that actually HAVE a googleId value.
// This allows unlimited local-auth users (no googleId) without duplicate-key collisions.
userSchema.index({ googleId: 1 }, { unique: true, sparse: true, name: 'googleId_sparse_unique' });

const User = mongoose.model("User", userSchema);

module.exports = User;