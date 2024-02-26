const { response, json } = require('express');
const { Course } = require('../models/user');
const User = require('../models/user');
const userInfo = require('../models/userInfo');

const userInfoPost = async (req, res) => {
  const { userName, courseAssigned } = req.body;
  const userEmail = await User.findOne({ email });
  const courseName = await Course.findOne({ courseName: courseAssigned });
  const miniUser = userEmail.id;

  //Checks if the desired course to assign exists
  if (!courseName) {
    return res.status(400).json({
      msg: 'The desired course to assign does not exist',
    });
  }

  const miniCourse = courseName.id;

  try {
    //Checks if the user is only assigned in three courses
    const userAssigned = await userInfo.countDocuments({ miniuser });
    if (userAssigned >= 3) {
      return res.status(400).json({
        msg: 'The student is already assigned in three courses',
      });
    }

    //Checks if the user is already in the described course
    const userInCourse = await userInfo.findOne({ miniUser, miniCourse });
    if (userInCourse) {
      return res.status(400).json({
        msg: 'The student is already in the described course',
      });
    }

    const userInfo = new userInfo({
      userName: miniUser,
      courseAssigned: miniCourse,
    });

    await userInfo.save();
    res.status(201).json({
      userInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Unexpected Error',
    });
  }
};

const userInfoGet = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, userInfo] = await Promise.all([
    userInfo.countDocuments(query),
    userInfo.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    userInfo,
  });
};

const userInfoGetById = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    //Checks if the user is not assigned to any course
    const assignedCourses = await userInfo
      .find({ userName: user.id, status: true })
      .populate('courseAssigned');

    if (assignedCourses.length === 0) {
      throw new Error('User Not Assigned');
    } else {
      const coursesList = assignedCourses.map((course) => ({
        courseName: course.courseAssigned.courseName,
        dateAssigned: course.dateAssigned,
      }));

      res.status(200).json({
        courses: coursesList,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Unexpected Error',
    });
  }
};

const userInfoDelete = async (req, res) => {
  const { id } = req.params;
  await userInfo.findByIdAndUpdate(id, { status: false });
  res.status(200).json({
    msg: 'User removed from course',
  });
};

module.exports = {
  userInfoPost,
  userInfoGet,
  userInfoGetById,
  userInfoDelete,
};
