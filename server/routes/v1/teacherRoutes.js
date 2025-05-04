const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacherController')

// Get students needing attention with their feedback
router.get('/students-needing-attention', teacherController.getStudentsNeedingAttention);

module.exports = router;