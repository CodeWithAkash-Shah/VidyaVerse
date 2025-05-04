const express = require("express");
const router = express.Router();
const AIController = require("../../AIModels/Ollama");

router.post("/ask", AIController.AskOllama);

module.exports = router;
