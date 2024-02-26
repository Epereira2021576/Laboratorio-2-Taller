const JWT = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {
  const token = req.header('x-token');
  if (!token)
    return res.status(401).json({ msg: 'Found no token currently active' });

  try {
    const { uid } = JWT.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(uid);
    if (!user) return res.status(401).json({ msg: 'Unable to find user' });

    if (!user.condition) {
      return res.status(401).json({
        msg: 'Invalid Token. Try Again',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Invalid Token',
    });
  }
};

module.exports = {
  validateJWT,
};
