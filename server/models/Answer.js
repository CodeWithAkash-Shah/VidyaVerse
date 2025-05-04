const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  doubt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt'
  },
  content: String,
  answered_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  is_ai: { type: Boolean, default: false },
  is_accepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
