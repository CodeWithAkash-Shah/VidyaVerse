const Student = require('../models/Student');
const Feedback = require('../models/Feedback');
const Teacher = require('../models/Teacher');

const doesStudentNeedAttention = (feedbacks) => {
  return feedbacks.some(
    (f) => (f.understanding === 'poor' || f.understanding === 'very-poor' || f.rating <= 2)
  );
};

exports.getStudentsNeedingAttention = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can access this data' });
    }

    // Find teacher details
    const teacher = await Teacher.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const { school, subjects, classes } = teacher;

    if (!school || !subjects.length || !classes.length) {
      return res.status(400).json({ message: 'Teacher data incomplete (school, subjects, or classes missing)' });
    }

    // Find students who match teacher's school, subjects, and classes
    const students = await Student.find({
      role: 'student',
      school: school,
      class: { $in: classes },
      favSubjects: { $in: subjects },
    }).lean();

    if (!students.length) {
      return res.status(200).json([]);
    }

    const studentIds = students.map(s => s._id);

    // Find feedbacks related to these students and teacher's subjects
    const feedbacks = await Feedback.find({
      student: { $in: studentIds },
      subject: { $in: subjects },
    }).populate('student', 'username class school')
      .lean();

    // Group feedback by student
    const feedbackByStudent = feedbacks.reduce((acc, feedback) => {
      const studentId = feedback.student._id.toString();
      if (!acc[studentId]) {
        acc[studentId] = [];
      }
      acc[studentId].push(feedback);
      return acc;
    }, {});

    // Prepare final list
    const studentsWithAttention = students
      .filter(student => feedbackByStudent[student._id]?.length > 0)
      .map(student => {
        const studentFeedbacks = feedbackByStudent[student._id] || [];
        const needsAttention = doesStudentNeedAttention(studentFeedbacks);

        return {
          ...student,
          feedback: studentFeedbacks,
          needsAttention,
        };
      })
      .slice(0, 3); // optional limit to 3 students for dashboard

    res.status(200).json(studentsWithAttention);

  } catch (error) {
    console.error('Error in getting students needing attention:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
