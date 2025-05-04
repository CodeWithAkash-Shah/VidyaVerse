const Student = require("../models/Student");

//Create New Student
exports.registerStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ message: "Student registered", student });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//Get Student by ID
exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Update Preferences
exports.updatePreferences = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { preferences: req.body.preferences },
            { new: true }
        );
        res.json({ message: "Preferences updated", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
