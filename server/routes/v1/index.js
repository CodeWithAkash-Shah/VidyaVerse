const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const doubtRoutes = require('./doubtRoutes');
const notesRoutes = require('./noteRoutes');
const OllamaRoute = require('./OllamaRoute');
const geminiRoutes = require('./geminiRoutes');
const teacherRoutes = require('./teacherRoutes')
const eventsRoutes = require('./eventRoutes')



// Mount the routes
router.use('/auth', authRoutes); // Public routes 
router.use('/student', protect, authorizeRoles('student'), studentRoutes); // Student-only routes
router.use('/doubts', protect, authorizeRoles('student'), doubtRoutes); // Student-only routes
router.use('/notes', protect, authorizeRoles('student', 'teacher'), notesRoutes); // Both roles : means student and teacher can access this route
router.use('/Ollama', protect, authorizeRoles('student', 'teacher'), OllamaRoute); // Both roles
router.use('/gemini',geminiRoutes);
router.use('/teacher', protect, authorizeRoles('teacher'), teacherRoutes);
router.use('/events', protect, authorizeRoles('student'), eventsRoutes)


// router.use('/teachers', protect, authorizeRoles('teacher'), teacherRoutes); // Teacher-only routes

router.get('/', (req, res) => {
    res.send('🎉 Backend is working perfectly! 🚀');
});

  
module.exports = router;

module.exports = router;