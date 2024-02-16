const User = require('../models/user');

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

module.exports = {
  emailExists,
  userExistsById,
};
