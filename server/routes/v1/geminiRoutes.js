const express = require('express');
const router = express.Router();
const { AskGemini, SummarizeClassFeedbackGemini, AskBasic, AskTeacherGemini } = require('../../controllers/GeminiController');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');

router.post('/basic', protect, authorizeRoles('student', 'teacher'), AskBasic);
router.post('/ask', protect, authorizeRoles('student'), AskGemini);
router.post('/summarize/:class', protect, authorizeRoles('teacher'), SummarizeClassFeedbackGemini)
router.post('/teacher/ask', protect, authorizeRoles('teacher'), AskTeacherGemini);

module.exports = router;