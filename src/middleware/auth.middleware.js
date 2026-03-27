const { verifyAccessToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Token missing",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "invalid_token",
      message: err.message.includes("expired")
        ? "Token expired"
        : "Invalid token",
    });
  }
};

module.exports = { authenticate };
