const Student = require("../models/Student");
const Doubt = require("../models/Doubt");
const Answer = require("../models/Answer");

// Ask a doubt 
const askDoubt = async (req, res) => {
  try {
    const { title, body, subject, topic, studentId } = req.body;
    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ error: "Student not found" });

    const doubt = await Doubt.create({
      title,
      body,
      subject,
      topic,
      author: student._id,
      class: student.class
    });
    const populatedDoubt = await Doubt.findById(doubt._id).populate("author", "username").sort({ createdAt: -1 });
    res.json(populatedDoubt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all doubts of a class
const getAllDoubts = async (req, res) => {
  try {
    const { class: classId } = req.params;

    const doubts = await Doubt.find({ class: classId })
      .populate("author", "username")
      .populate({
        path: 'answers', // virtual field
        select: 'content answered_by createdAt is_ai',
        populate: {
          path: 'answered_by',
          select: 'username'
        }
      }).sort({ createdAt: -1 });

    if (!doubts)
      return res.status(404).json({ error: "No doubts found" });

    res.json(doubts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


// Get all doubts of a student
const getStudentDoubts = async (req, res) => {
  try {
    const { id: studentId } = req.params;
    const doubts = await Doubt.find({ author: studentId }).populate("author", "username")
      .populate("author", "username")
      .populate({
        path: 'answers',
        select: 'content answered_by createdAt is_ai',
        populate: {
          path: 'answered_by',
          select: 'username'
        }
      }).sort({ createdAt: -1 });
    if (!doubts) return res.status(404).json({ error: "No doubts found" });

    res.json(doubts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Answer a doubt
// const answerDoubt = async (req, res) => {
//   try {
//     const { content, studentId, is_ai } = req.body;
//     const { doubtId } = req.params;

//     const answerData  = await Answer.create({
//       doubt: doubtId,
//       content,
//       answered_by: studentId,
//       is_ai: is_ai || false
//     });

//     if (!is_ai) {
//       answerData.answered_by = studentId; // Only assign if it's a real student
//     }
//     const answer = await Answer.create(answerData);

//     if (is_ai) {
//       await Doubt.findByIdAndUpdate(doubtId, { hasAiResponse: true });
//     }
//     // Populate the answered_by field before sending the response
//     const populatedAnswer = await Answer.findById(answer._id).populate("answered_by", "username");
//     res.json(populatedAnswer);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }

const answerDoubt = async (req, res) => {
  try {
    const { content, studentId, is_ai } = req.body;
    const { doubtId } = req.params;

    const answerPayload = {
      doubt: doubtId,
      content,
      is_ai: is_ai || false
    };

    if (!is_ai) {
      answerPayload.answered_by = studentId; // Only set if it's a real student
    }

    const answer = await Answer.create(answerPayload);

    if (is_ai) {
      await Doubt.findByIdAndUpdate(doubtId, { hasAiResponse: true });
    }

    const populatedAnswer = await Answer.findById(answer._id).populate("answered_by", "username");
    res.json(populatedAnswer);
  } catch (err) {
    console.error("Error saving answer:", err);
    res.status(400).json({ error: err.message });
  }
}


module.exports = { askDoubt, getAllDoubts, getStudentDoubts, answerDoubt };