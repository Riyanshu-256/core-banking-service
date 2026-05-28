// This middleware checks whether the user is logged in or not before allowing access to protected/private APIs

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  // Get token from cookies or authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // If token is missing, deny access
  if (!token) {
    return res.status(401).json({
      message: "Access denied. Authentication token is missing.",
    });
  }

  try {
    // Verify token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database using decoded userId
    const user = await userModel.findById(decoded.userId);

    // Store user data inside request object
    req.user = user;

    // Move to next middleware or route
    return next();
  } catch (err) {
    // If token is invalid, deny access
    return res.status(401).json({
      message: "Access denied. Invalid or expired token.",
    });
  }
}

module.exports = {
  authMiddleware,
};
