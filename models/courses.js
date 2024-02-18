const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const CourseSchema = Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
  },

  courseTeacher: {
    type: String,
    required: [true, 'Course teacher is required'],
  },
});

const Courses = mongoose.model('Courses', CourseSchema);
module.exports = Courses;
