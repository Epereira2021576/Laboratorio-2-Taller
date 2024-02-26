const JWT = require('jsonwebtoken');

const generateJWTKey = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    JWT.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
      (error, token) =>
        error
          ? (console.log(error), reject('Error generating token'))
          : resolve(token)
    );
  });
};

module.exports = {
  generateJWTKey,
};
