const validator = require("validator");
const { hashPassword, comparePassword } = require("../utils/hash");
const {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserWithPassword,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  findUserById,
} = require("../services/auth.service");
const { generateAccessToken } = require("../utils/jwt");
const { generateRefreshToken } = require("../utils/token");


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "invalid input",
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "invalid_email",
        message: "Invalid email format",
      });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "weak_password",
        message:
          "Password must be at least 8 characters with one number and one special character",
      });
    }

    const existingUser = await findUserByUsername(username);
    const existingEmail = await findUserByEmail(email);
    if (existingUser || existingEmail) {
      return res.status(409).json({
        error: "conflict",
        message: "Username or email already exists",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await createUser(username, email, passwordHash);

    return res.status(201).json({
      id: user.id,
      username: user.username,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({
      error: "server_error",
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        error: "invalid_input",
        message: "Username and password are required",
      });
    }

    const user = await findUserWithPassword(username);
    if (!user) {
      return res.status(401).json({
        error: "invalid_credentials",
        message: "Invalid username or password",
      });
    }
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: "invalid_credentials",
        message: "Invalid username or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await saveRefreshToken(user.id, refreshToken, expiresAt);

    return res.status(200).json({
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: 900,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      error: "server_error",
      message: "Something went wrong",
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(401).json({
        error: "invalid_token",
        message: "Refresh token not found",
      });
    }

    const storedToken = await findRefreshToken(refresh_token);

    if (!storedToken) {
      return res.status(401).json({
        error: "invalid_token",
        message: "Refresh token not found",
      });
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      return res.status(401).json({
        error: "token_expired",
        message: "Refresh token expired",
      });
    }

    const user = await findUserById(storedToken.user_id);
    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: 900,
    });
  } catch (error) {
    console.error("Refresh error:", error.message);
    return res.status(500).json({
      error: "server_error",
      message: "Something went wrong",
    });
  }
};

const logout = async (req, res) => {
  try {
    const {refresh_token} = req.body;
    if (!refresh_token) {
      return res.status(400).json({
        error: "invalid_input",
        message: "Refresh token required",
      });
    }

    await deleteRefreshToken(refresh_token);

    return res.status(204).send();
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      error: "server_error",
      message: "Something went wrong",
    });
  }
}

module.exports = { register, login, refresh, logout };
