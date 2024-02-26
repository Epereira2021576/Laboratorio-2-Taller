const { Schema, model } = require('mongoose');

const UserInfoSchema = Schema({
  userName: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a username'],
  },

  courseAssigned: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },

  dateAssigned: {
    type: Date,
    default: Date.now(),
  },

  status: {
    type: Boolean,
    default: true,
  },
});

const userInfo = mongoose.model('userInfo', UserInfoSchema);
