const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    subject: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    dateUploaded: { type: Date, default: Date.now },
    files: [
        {
            url: { type: String, required: true },
            fileName: { type: String, required: true },
            fileSize: { type: String },
            mimeType: { type: String }, // To differentiate PDFs and images
        },
    ],
    bookmarked: { type: Boolean, default: false },
    dateUploaded: { type: String, default: () => new Date().toLocaleDateString() },
});

module.exports = mongoose.model("Note", noteSchema);