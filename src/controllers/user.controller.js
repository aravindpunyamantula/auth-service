const pool = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const username = req.user.sub;

    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE username = $1",
      [username]
    );

    const user = result.rows[0];

    return res.status(200).json({
      ...user,
      roles: req.user.roles,
    });
  } catch (err) {
    return res.status(500).json({
      error: "server_error",
      message: "Something went wrong",
    });
  }
};

module.exports = { getProfile };