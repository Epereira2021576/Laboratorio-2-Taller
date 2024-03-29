const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

//Method to post users to DB
const userPost = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role, course });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  res.status(200).json({
    user,
  });
};

// MEthod to get a list of the existent users in the DB
const userGet = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

//Method to update a user in the DB
const userPut = async (req, res) => {
  const { id } = req.params;
  const { _id, email, password, role, ...rest } = req.body;

  await User.findByIdAndUpdate(id, rest);
  const user = await User.findOne({ _id: id });

  res.status(200).json({
    msg: 'User updated successfully',
    user,
  });
};

//Method to get user by id
const userGetById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  res.status(200).json({
    user,
  });
};

//method to delete a user from the DB
const userDelete = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { state: false });
  res.status(200).json({
    msg: 'User deleted successfully',
    user,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const generatedToken = await generateJWT(user.id);
    //return json web token and user data
    res.status(200).json({
      user,
      token: `Take note of your token: ${generatedToken}`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  userPost,
  userGet,
  userPut,
  userGetById,
  userDelete,
  userLogin,
};
