const { User, Course } = require('../models/user');

const verifyStudentRole = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role !== 'STUDENT_ROLE') {
    return res.status(403).json({ message: 'Forbidden content or function' });
  }
  next();
};

const studentNotInCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user._id);
  if (user.course.includes(course._id)) {
    return res
      .status(400)
      .json({ message: 'Student is already enrolled in this course' });
  }
  next();
};
