const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'archived'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: String
  },
  archivedAt: {
    type: Date
  },
  replies: [
    {
      message: String,
      repliedBy: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Inquiry', inquirySchema);
