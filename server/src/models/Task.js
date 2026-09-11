const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false } 
);

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'NEED_DECISION', 'DONE'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    category: {
      type: String,
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    decisionDetails: {
      type: String,
      default: null,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);