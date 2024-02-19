const { User, Course } = require('../models/user');

const emailExists = async (email = '') => {
  const emailUser = await User.findOne({ email });
  if (emailUser) {
    throw new Error(`The email ${email} already exists`);
  }
};

const userExistsById = async (id = '') => {
  const user = await User.findOne({ id });

  if (!user) {
    throw new Error(`The user with the id ${id} does not exist`);
  }
};

const courseNameExists = async (name = '') => {
  const course = await Course.findOne({ name });
  if (course) {
    throw new Error(`The course name ${name} already exists`);
  }
};

const courseExistsById = async (id = '') => {
  const course = await Course.findById(id);
  if (!course) {
    throw new Error(`The course with id ${id} does not exist`);
  }
};

module.exports = {
  emailExists,
  userExistsById,
};
