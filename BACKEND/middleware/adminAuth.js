const jwt = require("jsonwebtoken");
require("dotenv").config();

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return req.cookies?.adminToken || req.cookies?.authToken || null;
};

const requireAdminAuth = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(403).json({ message: "Access denied. No admin token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Invalid or expired admin token." });
      }

      if (decoded?.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }

      req.user = decoded.user;
      req.role = decoded.role;
      next();
    });
  } catch (error) {
    console.error("Unexpected admin auth error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = requireAdminAuth;