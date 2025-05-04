const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  title: String,
  body: String,
  subject: String,
  topic: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  class: String,
  hasAiResponse: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// making reversed relationship with Answer model to get all answers for a doubt
doubtSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'doubt'
});

doubtSchema.set('toObject', { virtuals: true });
doubtSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Doubt', doubtSchema);