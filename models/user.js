const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
// User Schema
const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
  },

  role: {
    type: String,
    required: true,
    enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
    default: 'STUDENT_ROLE',
  },

  condition: {
    type: Boolean,
    default: true,
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = bcryptjs.genSaltSync();
    this.password = bcryptjs.hashSync(this.password, salt);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

const User = mongoose.model('User', UserSchema);

const courseSchema = Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
  },

  courseType: {
    type: String,
    required: true,
    enum: [
      'Bussiness Management',
      'Social Studies',
      'Exact Sciences',
      'Technology',
      'Independent Study',
      'No Class Type',
    ],
    default: 'No Class Type',
  },
  courseTeacher: {
    type: String,
    required: [true, 'Course teacher is required'],
  },

  courseState: {
    type: Boolean,
    default: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

(module.exports = User), Course;
