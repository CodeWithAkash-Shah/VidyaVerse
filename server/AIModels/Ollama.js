const Student = require('../models/Student'); // Assuming you have a Student model defined
const axios = require('axios');
const Feedback = require("../models/Feedback");
const Teacher = require("../models/Teacher");
const ollamalocalhost = process.env.OLLAMA_LOCALHOST || "http://localhost:11434";

exports.AskOllama = async (req, res) => {
    const { prompt, studentId, isNewConversation = true } = req.body;

    try {
        // Fetch student preferences 
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        // Use student preferences to modify the prompt
        const customPrompt = `
        You're a friendly AI buddy who chats like a close friend. The student’s name is ${student.username}, and they sometimes struggle with ${student.weakSubject}. 
        They like learning explained ${student.preferences?.style || "in a simple way"}.
        
        ${isNewConversation
                ? `Start by greeting ${student.username}, mention you're here to help with ${student.weakSubject}, then casually answer their question. If only just say hi, then greet them back.`
                : `Just answer the question clearly and casually like you're chatting.`
            }
        Respond using simple HTML tags like:
        <h2> for headings
        <p> for paragraphs
        <ul><li> for points
        <b> for highlighting important stuff
        
        Student's Question: "${prompt}"
        `;

        const response = await axios.post(`${ollamalocalhost}/api/generate`, {
            model: "llama3",
            prompt: customPrompt,
            stream: false
        });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to get response from Ollama" });
    }
};


exports.SummarizeClassFeedback = async (req, res) => {
    const { class: className } = req.params;
    const { teacherId, subject } = req.body;
    console.log(`Class: ${className}, Teacher ID: ${teacherId}, Subject: ${subject}`);

    try {
        if (!className || typeof className !== "string") {
            return res.status(400).json({ error: "Invalid class parameter" });
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        const teacherSubjects = teacher.subject.split(",").map(s => s.trim().toLowerCase());
        if (!teacherSubjects.includes(subject.toLowerCase())) {
            return res.status(400).json({ error: `Teacher does not teach ${subject}` });
        }

        if (!teacher.classes.includes(className)) {
            return res.status(400).json({ error: `Teacher does not teach Class ${className}` });
        }

        // Fetch feedback for the given subject (case-insensitive)
        const feedbackData = await Feedback.find({
            subject: { $regex: `^${subject}$`, $options: "i" }
        }).populate("student", "username class school");

        if (!feedbackData.length) {
            return res.status(404).json({ error: `No feedback found for subject: ${subject}` });
        }

        // Filter feedback to include only students from the teacher's school and requested class
        const filteredFeedback = feedbackData.filter(fb => {
            const student = fb.student;
            return (
                student &&
                student.school === teacher.school &&
                student.class === className
            );
        });

        if (!filteredFeedback.length) {
            return res.status(404).json({ error: `No feedback found for Class ${className}, subject: ${subject} at ${teacher.school}` });
        }

        // Create feedback summary
        const feedbackSummary = filteredFeedback.map(fb => ({
            student: fb.student?.username || "Anonymous",
            understanding: fb.understanding,
            rating: fb.rating,
            feedback: fb.feedback || "No additional comments"
        }));

        const understandingCounts = feedbackSummary.reduce((acc, fb) => {
            acc[fb.understanding] = (acc[fb.understanding] || 0) + 1;
            return acc;
        }, {});
        const averageRating = (feedbackSummary.reduce((sum, fb) => sum + fb.rating, 0) / feedbackSummary.length).toFixed(2);

        const prompt = `
        You are an AI assistant summarizing feedback for a teacher named ${teacher.email} (ID: ${teacher._id}) at ${teacher.school}. 
        The teacher teaches ${subject} to Class ${className} students. Below is the feedback data from students:

        Feedback Data:
        ${JSON.stringify(feedbackSummary, null, 2)}

        Summary Stats:
        - Understanding Levels: ${JSON.stringify(understandingCounts)}
        - Average Rating: ${averageRating} / 5

        Summarize the feedback in a concise report. Highlight:
        - Overall understanding levels (e.g., how many students rated excellent, good, etc.).
        - Average rating out of 5.
        - Common themes or specific comments from the feedback (e.g., "Great Class").
        - Suggestions for improving teaching based on the feedback.

        Format the response using simple HTML tags:
        <h2> for headings
        <p> for paragraphs
        <ul><li> for points
        <b> for highlighting important points
        `;

        const response = await axios.post(`${ollamalocalhost}/api/generate`, {
            model: "llama3",
            prompt: prompt,
            stream: false
        });

        res.json({ summary: response.data.response });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to generate summary" });
    }
};