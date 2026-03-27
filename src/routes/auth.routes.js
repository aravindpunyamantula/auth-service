const express = require('express');
const { register, login, refresh, logout} = require('../controllers/auth.controller');
const { loginLimiter} = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter,login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;