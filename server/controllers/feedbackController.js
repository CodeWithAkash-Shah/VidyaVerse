const Feedback = require("../models/Feedback");

const submitFeedback = async (req, res) => {
    try {
        const { subject, understanding, rating, feedback, studentId } = req.body;

        const newFeedback = new Feedback({
            student: studentId,
            subject,
            understanding,
            rating,
            feedback,
        });

        await newFeedback.save();

        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { submitFeedback };
