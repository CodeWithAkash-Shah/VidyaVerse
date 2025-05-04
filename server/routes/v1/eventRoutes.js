const express = require('express');
const router = express.Router();
const GoogleScrapSearchController = require('../../controllers/GoogleScrapSearchController');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');

router.get('/search', protect, authorizeRoles('student'), GoogleScrapSearchController.SearchEvents);

module.exports = router;