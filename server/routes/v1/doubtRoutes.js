const express = require('express');
const router = express.Router();
const { askDoubt, getAllDoubts, getStudentDoubts, answerDoubt } = require('../../controllers/doubtController');

router.post('/ask', askDoubt);
router.get('/all/:class', getAllDoubts);
router.get('/:id', getStudentDoubts);
router.post('/:doubtId/answer', answerDoubt );

module.exports = router;
