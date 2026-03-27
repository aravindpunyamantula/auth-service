const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
    console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error:", err);
});

module.exports = pool;