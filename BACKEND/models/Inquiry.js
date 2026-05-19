const mongoose = require('mongoose');

const { Schema } = mongoose;

const InquirySchema = new Schema({
  title: { type: String, required: false },
  message: { type: String, required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: false },
  sender: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  status: {
    type: String,
    enum: ['new', 'open', 'closed', 'archived'],
    default: 'new',
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  metadata: { type: Schema.Types.Mixed },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
