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

  course: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = bcryptjs.genSaltSync();
    this.password = bcryptjs.hashSync(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

const courseSchema = Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
  },

  courseTeacher: {
    type: String,
    required: [true, 'Course teacher is required'],
  },
});

const Course = mongoose.model('Course', courseSchema);

(module.exports = User), Course;
