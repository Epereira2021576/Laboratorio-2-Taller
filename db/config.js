const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {});
    console.log('Database connection succesfull!');
  } catch (e) {
    throw new Error('Error connecting to database', e);
  }
};

module.exports = {
  dbConnection,
};
