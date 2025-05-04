const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    history: [{
        role: { type: String, enum: ['user', 'model'], required: true },
        parts: [{ text: { type: String, required: true } }],
    }],
    updatedAt: { type: Date, default: Date.now },
});

chatHistorySchema.index({ studentId: 1 });
module.exports = mongoose.model('ChatHistory', chatHistorySchema);