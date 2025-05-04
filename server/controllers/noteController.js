const Note = require("../models/Note");
const imageKit = require("../utils/imageKit");
const Student = require("../models/Student");

// Upload a notes
const uploadNote = async (req, res) => {
    try {
        const { title, description, subject, username } = req.body;
        const files = req.files;

        if (!title || !description || !subject || !files || files.length === 0) {
            return res.status(400).json({ message: "All fields and at least one file are required." });
        }

        const student = await Student.findOne({ username });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Upload files to ImageKit
        const uploadedFiles = [];
        for (const file of files) {
            const uploadResponse = await imageKit.upload({
                file: file.buffer,
                fileName: `note-files/${Date.now()}_${file.originalname}`,
                useUniqueFileName: true,
            });
            uploadedFiles.push({
                url: uploadResponse.url,
                fileName: file.originalname,
                fileSize: `${(uploadResponse.size / 1024).toFixed(2)} KB`,
                mimeType: file.mimetype, // Store MIME type for rendering decisions
            });
        }

        const newNote = new Note({
            title,
            description,
            subject,
            files: uploadedFiles, // Store array of file metadata
            uploadedBy: student._id,
        });

        await newNote.save();
        res.status(201).json({ message: "Note uploaded successfully", note: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading note" });
    }
};

//Get all notes by id
const getAllNotes = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Student ID:", id);
        if (!id) {
            return res.status(400).json({ message: "Student ID is required" });
        }
        const notes = await Note.find({ uploadedBy: id });
        if (!notes || notes.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const bookmarked = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        note.bookmarked = !note.bookmarked;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle bookmark', error });
    }
}

module.exports = { uploadNote, getAllNotes, bookmarked };
