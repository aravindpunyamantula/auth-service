const express = require('express');
const dotenv = require('dotenv');

const pool = require('./config/db');
const initDB = require('./config/initdb');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require("./routes/user.routes");

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
res.status(200).json({status: 'OK'})});

app.use('/api/auth', authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.API_PORT || 8080;
(async () => {
    
    try {
        const res = await pool.query("SELECT NOW()");
        console.log(`DB Time: ${res.rows[0]}`);
        await initDB(); 
    } catch (error) {
        console.error('DB connection failed:', error.message);
    }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});