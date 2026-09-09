const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware: verifies JWT token and attaches user to req.user
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = authHeader.split(' ')[1];

      // Verify token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password hash)
      req.user = await User.findById(decoded.userId).select('-passwordHash');

      next(); // token is valid, move to the next handler
    } catch (error) {
      res.status(401).json({ message: 'Token is invalid or expired' });
    }
  } else {
    res.status(401).json({ message: 'No token found, authorization denied' });
  }
};

module.exports = { protect };