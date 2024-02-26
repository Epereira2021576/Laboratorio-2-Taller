const { response, json } = require('express');
const { Course } = require('../models/user');

// Method to post courses to DB
const coursePost = async (req, res) => {
  const { courseName, courseType, courseTeacher } = req.body;
  const course = new Course({
    courseName,
    courseType,
    courseTeacher,
  });

  //Verifications in case a teacher doesnt exist or a student tries to create a course
  const teacher = await User.findOne({ email: courseTeacher });
  if (!teacher) {
    return res.status(400).json({
      msg: 'The teacher does not exist',
    });
  } else if (teacher.role === 'STUDENT_ROLE') {
    return res.status(400).json({
      msg: 'A student cannot create a course',
    });
  }

  await course.save();
  res.status(200).json({
    course,
  });
};

// Method to get courses from DB
const courseGet = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { state: true };

  const [total, courses] = await Promise.all([
    Course.countDocuments(query),
    Course.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    courses,
  });
};

// Method to update a course in the DB
const coursePut = async (req, res) => {
  const { id } = req.params;
  const { courseName, courseTeacher, ...rest } = req.body;

  await Course.findByIdAndUpdate(id, rest);
  const course = await Course.findById(id);

  res.status(200).json({
    msg: 'Course updated successfully',
    course,
  });
};

//Method to get course by id
const courseGetById = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  res.status(200).json({
    course,
  });
};

// Method to delete a course from the DB
const courseDelete = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, { state: false });
  res.status(200).json({
    msg: 'Course deleted successfully',
    course,
  });
};

module.exports = {
  coursePost,
  courseGet,
  coursePut,
  courseGetById,
  courseDelete,
};
