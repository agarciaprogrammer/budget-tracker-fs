// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máx 5 intentos por IP
  message: 'Demasiados intentos. Intenta nuevamente en 15 minutos.'
});

router.post('/login', loginLimiter, authController.login);
router.post('/register', authController.register);

module.exports = router;