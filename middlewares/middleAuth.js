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

const studentInCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user._id);
  if (!user.course.includes(course._id)) {
    return res
      .status(400)
      .json({ message: 'Student is not enrolled in this course' });
  }
  next();
};

const teacherOrSameUser = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user._id);
  if (
    user.role === 'STUDENT_ROLE' &&
    course.teacher._id.toString() !== user._id.toString()
  ) {
    return res.status(403).json({ message: 'Forbidden content' });
  }
  next();
};

const courseIsTeacher = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user._id);
  if (course.teacher._id.toString() !== user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

const courseHasThree = async (req, res, next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      message: 'Course not found',
    });
  }

  if (course.students.length >= 3) {
    return res.status(400).json({
      message:
        'This course has already reached its maximum capacity of 3 students',
    });
  }

  next();
};

module.exports = {
  verifyStudentRole,
  studentNotInCourse,
  studentInCourse,
  teacherOrSameUser,
  courseIsTeacher,
  courseHasThree,
};
