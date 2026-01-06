const express = require('express');
const {
  validateUserRegistration,
  validateUserLogin
} = require('../middlewares/validation');
const authController = require('../controllers/AuthController');

const router = express.Router();

// Register route
router.post('/register', validateUserRegistration, (req, res, next) => authController.register(req, res, next));

// Login route
router.post('/login', validateUserLogin, (req, res, next) => authController.login(req, res, next));

// Logout route
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

module.exports = router;