const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH);
const publicKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH);

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      iss: "auth-service",
      sub: user.username,
      roles: ["user"],
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "15m" },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
};

module.exports = { generateAccessToken, verifyAccessToken };
