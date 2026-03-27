const { default: isEmail } = require("validator/lib/isEmail");
const pool = require("../config/db");

const createUser = async (username, email, passwordHash) => {
  const query =
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username";

  const values = [username, email, passwordHash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const res = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const saveRefreshToken = async (userId, TokenExpiredError, expiresAt) => {
  const query = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`;
  await pool.query(query, [userId, TokenExpiredError, expiresAt]);
};

const findUserWithPassword = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

const findRefreshToken = async (token) => {
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1",
    [token],
  );
  return result.rows[0];
};

const deleteRefreshToken = async (token) => {
  await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserByEmail,
  saveRefreshToken,
  findUserWithPassword,
  findRefreshToken,
  deleteRefreshToken,
  findUserById
};
