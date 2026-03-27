const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
res.status(200).json({status: 'OK'})});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});