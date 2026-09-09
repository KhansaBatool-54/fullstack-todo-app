const jwt = require('jsonwebtoken');

// Generates a signed JWT containing the user's ID, valid for 30 days
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;