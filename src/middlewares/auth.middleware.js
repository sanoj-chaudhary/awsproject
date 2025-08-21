const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) =>{
  try {
    // Get token from header
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: 0, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request

    next(); // Continue to the next middleware/route
  } catch (err) {
    return res.status(401).json({ success: 0, message: "Invalid or expired token." });
  }
};

module.exports =authMiddleware