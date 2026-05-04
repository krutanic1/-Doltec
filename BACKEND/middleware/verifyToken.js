const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);

        res.clearCookie("authToken", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });

        return res.status(401).json({ message: "Invalid or expired token. Logged out." });
      }

      req.user = decoded.user;
      req.role = decoded.role;
      next();
    });
  } catch (error) {
    console.error("Unexpected error in token verification:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = verifyToken;
