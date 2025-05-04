const express = require("express");
const router = express.Router();
const studentController = require("../../controllers/studentController");
const { submitFeedback } = require("../../controllers/feedbackController");

router.post("/register", studentController.registerStudent);
router.get("/:id", studentController.getStudent);
// router.put("/:id/preferences", studentController.updatePreferences);
router.post("/feedback", submitFeedback);

module.exports = router;
