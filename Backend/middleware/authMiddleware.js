const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header contains a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.user.id).select("-password");

      next();
    } catch (error) {
      console.error("Token Verification Failed", error);
      return res.status(401).json({ message: "Not Authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not Authorized, No token provided" });
  }
};


//Check if user == admin

const admin = (req, res, next) =>{
  if(req.user && req.user.role === "admin") {
    next();
  }
  else{
    res.status(403).json({message: "Not Authorized as an Admin!"});
  }
};

module.exports = { protect, admin };
