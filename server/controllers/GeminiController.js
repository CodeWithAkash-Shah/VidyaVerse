const { GoogleGenerativeAI } = require('@google/generative-ai');
const Student = require('../models/Student');
const Feedback = require('../models/Feedback');
const Teacher = require('../models/Teacher');
const Answer = require('../models/Answer');

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Utility to generate Gemini model instance
const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
    return genAI.getGenerativeModel({ model: modelName });
};


// Function to provide basic platform information
exports.AskBasic = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        // Get the question from the input
        const userInput = req.body.input.message?.trim().toLowerCase();
        if (!userInput) {
            return res.status(400).json({ error: "No question provided" });
        }

        // List of predefined questions and their corresponding responses
        const questionsAndAnswers = {
            "what is vidyaverse and how can it help me with my studies?": "VidyaVerse is an AI-powered learning platform designed to assist students by offering personalized learning experiences, peer doubt-solving, feedback dashboards for teachers, and much more.",
            "how does peer doubt-solving work on the platform?": "Peer doubt-solving allows students to ask questions, which other students in the same class can answer. This fosters collaboration and encourages students to help each other.",
            "can i upload my class notes and get ai insights?": "Currently, VidyaVerse does not support uploading notes, but the platform helps you by providing personalized answers and insights based on your weak subjects and learning style.",
            "how do i provide feedback on my classes?": "You can provide feedback on classes through the student dashboard, where you'll find a dedicated feedback section. Your responses will help teachers improve their instructional methods.",
            "what kind of events can i expect on vidyaverse?": "VidyaVerse hosts various educational events, including online contests, quizzes, and workshops designed to help students enhance their skills and knowledge.",
            "how does the ai tailor answers to my weak subjects?": "The AI analyzes your learning profile and weak subjects, providing answers and resources that focus on improving your understanding in those areas.",
            "what insights do teachers get from student feedback?": "Teachers receive personalized insights about student engagement, progress, and areas where students are struggling. This helps them improve their teaching methods.",
            "how can i stay updated on exams and competitions?": "You can stay updated on exams and competitions by visiting the 'Events' section on your dashboard, where you'll find announcements about upcoming contests and exams."
        };

        // Check if the question matches any of the predefined questions
        const responseText = questionsAndAnswers[userInput] || "Sorry, I can only answer questions related to the platform's features.";

        // Send the AI response based on the question
        res.json({ response: responseText });

    } catch (error) {
        console.error("AskBasic Error:", error.message, error.stack);
        const status = error.code === "ECONNREFUSED" ? 503 : 500;
        res.status(status).json({ error: "Failed to process basic request", details: error.message });
    }
};

// Function to ask Gemini model a question
exports.AskGemini = async (req, res) => {
    const { prompt, studentId } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string' || !studentId) {
        return res.status(400).json({ error: 'Invalid prompt or studentId' });
    }

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Construct the custom prompt (directly answering)
        const { Subject, Topic, Question } = req.body;
        console.log(req.body, "------------------");


        // Check if Subject matches student's weakSubjects
        const isWeakSubject = student.weakSubjects?.includes(Subject);

        // Build a motivational line if needed
        const motivationLine = isWeakSubject
            ? `Don't worry ${student.username}! I know ${Subject} can feel a bit tricky sometimes, but I'm here to help you out. I'll even explain with an example! 📚`
            : `Let's dive into your question about ${Question}! 🚀`;

        const customPrompt = `
            You're a friendly AI buddy who chats like a close friend. 
            The student’s name is ${student.username}.
            They like learning explained ${student.preferences?.style || 'in a simple way'}.
            "Keep the language simple and assume the student is in high school or early college."
            
            ${motivationLine}
            
            Here are the details of the student's question:
            
            <h2>Subject:</h2> 
            <p>${Subject}</p>
            
            <h2>Topic:</h2> 
            <p>${Topic}</p>
            
            <h2>Question Title:</h2> 
            <p><b>${Question}</b></p>
            
            <h2>Question Description:</h2> 
            <p>${prompt}</p>
            
            Now, please explain the answer clearly and casually like you're chatting with a close friend. 
            Make sure the explanation feels supportive, friendly, and very easy to understand.
            
            Please format the answer using simple HTML tags:
            <ul>
            <li><b>&lt;h2&gt;</b> for headings</li>
            <li><b>&lt;p&gt;</b> for paragraphs</li>
            <li><b>&lt;ul&gt;&lt;li&gt;</b> for points</li>
            <li><b>&lt;b&gt;</b> for highlighting important stuff</li>
            <li><b>&lt;i&gt;</b> for italicizing words</li>
            <li><b>&lt;code&gt;</b> for code snippets</li>
            <li><b>&lt;a href="link"&gt;</b> for links</li>
            </ul>
            `;



        // Initialize chat without history
        const model = getGeminiModel();
        const chat = model.startChat({ history: [] });
        // Send prompt and get response
        const result = await chat.sendMessage(customPrompt);
        const responseText = await result.response.text();
        // Create an Answer documen
        res.json({ response: responseText });
    } catch (error) {
        console.error('AskGemini Error:', error.message);
        const status = error.code === 'ECONNREFUSED' ? 503 : 500;
        res.status(status).json({ error: 'Failed to get response from Gemini', details: error.message });
    }
};


// Function to summarize class feedback
exports.SummarizeClassFeedbackGemini = async (req, res) => {
    const { class: className } = req.params;
    const { teacherId, subject } = req.body;

    // Input validation
    if (!className || typeof className !== 'string' || !teacherId || !subject) {
        return res.status(400).json({ error: 'Invalid className, teacherId, or subject' });
    }

    try {
        // Fetch teacher with lean query
        const teacher = await Teacher.findById(teacherId).lean();
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const teacherSubjects = teacher.subjects.map(s => s.trim().toLowerCase());
        if (!teacherSubjects.includes(subject.toLowerCase())) {
            return res.status(400).json({ error: `Teacher does not teach ${subject}` });
        }

        if (!teacher.classes.includes(className)) {
            return res.status(400).json({ error: `Teacher does not teach Class ${className}` });
        }

        // Fetch feedback with lean query
        const feedbackData = await Feedback.find({
            subject: { $regex: `^${subject}$`, $options: 'i' },
        })
            .populate('student', 'username class school')
            .lean();

        if (!feedbackData.length) {
            return res.status(404).json({ error: `No feedback found for subject: ${subject}` });
        }

        // Filter feedback
        const filteredFeedback = feedbackData.filter(fb => {
            const student = fb.student;
            return student && student.school === teacher.school && student.class === className;
        });

        if (!filteredFeedback.length) {
            return res.status(404).json({
                error: `No feedback found for Class ${className}, subject: ${subject} at ${teacher.school}`,
            });
        }

        // Create feedback summary
        const feedbackSummary = filteredFeedback.map(fb => ({
            student: fb.student?.username || 'Anonymous',
            understanding: fb.understanding,
            rating: fb.rating,
            feedback: fb.feedback || 'No additional comments',
        }));

        const understandingCounts = feedbackSummary.reduce((acc, fb) => {
            acc[fb.understanding] = (acc[fb.understanding] || 0) + 1;
            return acc;
        }, {});
        const averageRating = (
            feedbackSummary.reduce((sum, fb) => sum + fb.rating, 0) / feedbackSummary.length
        ).toFixed(2);

        // Construct prompt
        const prompt = `
        You are an AI assistant summarizing feedback for a teacher named ${teacher.email} (ID: ${teacher._id}) at ${teacher.school}.
        The teacher teaches ${subject} to Class ${className} students. Below is the feedback data from students:

        Feedback Data:
        ${feedbackSummary.map(fb => `- ${fb.student}: ${fb.understanding}, ${fb.rating}/5, "${fb.feedback}"`).join('\n')}

        Summary Stats:
        - Understanding Levels: ${Object.entries(understandingCounts).map(([key, val]) => `${key}: ${val}`).join(', ')}
        - Average Rating: ${averageRating} / 5

        Summarize the feedback in a concise report. Highlight:
        - Overall understanding levels (e.g., how many students rated excellent, good, etc.).
        - Average rating out of 5.
        - Common themes or specific comments from the feedback (e.g., "Great Class").
        - Suggestions for improving teaching based on the feedback.

        - Any other relevant insights that can help the teacher improve their teaching methods.
        - Use simple HTML tags for formatting:
        <h2> for headings
        <p> for paragraphs
        <ul><li> for points
        <b> for highlighting important stuff
        <i> for italicizing words

        `;

        // Generate summary
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        res.json({ summary: responseText });
    } catch (error) {
        console.error('SummarizeClassFeedbackGemini Error:', error.message);
        const status = error.code === 'ECONNREFUSED' ? 503 : 500;
        res.status(status).json({ error: 'Failed to generate summary from Gemini', details: error.message });
    }
};


// For Teacher 
exports.AskTeacherGemini = async (req, res) => {
    const { prompt, topic, question } = req.body;
    const user = req.user;

    // Input validation
    if (!prompt || !topic || !question || !user) {
        return res.status(400).json({ error: 'Invalid input or user not authenticated' });
    }

    try {
        // Fetch teacher details
        const teacher = await Teacher.findById(user.id).lean();
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Verify teacher teaches the subject
        const teacherSubjects = teacher.subjects.map(s => s.trim().toLowerCase());

        // Construct teacher-specific prompt
        const customPrompt = `
            You are an AI assistant for a teacher named ${teacher.username} at ${teacher.school}.
            The teacher teaches ${teacherSubjects} and has ${teacher.experience} years of experience.
            The question is related to their teaching:

            <h2>Subject:</h2>
            <p>${teacherSubjects}</p>

            <h2>Topic:</h2>
            <p>${topic}</p>

            <h2>Question:</h2>
            <p><b>${question}</b></p>

            <h2>Question Description:</h2>
            <p>${prompt}</p>

            Provide a detailed, professional response to assist the teacher in their teaching duties.
            Focus on pedagogical strategies, classroom engagement, or subject-specific insights.
            Use simple HTML tags for formatting:
            <h2> for headings
            <p> for paragraphs
            <ul><li> for points
            <b> for highlighting
            <i> for italicizing
        `;

        // Initialize Gemini model and get response
        const model = getGeminiModel();
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage(customPrompt);
        const responseText = await result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error('AskTeacherGemini Error:', error.message);
        const status = error.code === 'ECONNREFUSED' ? 503 : 500;
        res.status(status).json({ error: 'Failed to get response from Gemini', details: error.message });
    }
};