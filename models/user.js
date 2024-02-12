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
