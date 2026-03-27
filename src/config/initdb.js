const fs = require("fs");
const path = require("path");
const pool = require("./db");

const initDB = async () => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "../models/init.sql"),
      "utf-8",
    );
    await pool.query(sql);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("DB init error:", err.message);
  }
};
module.exports = initDB;
