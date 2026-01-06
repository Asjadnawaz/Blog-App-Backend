const express = require('express');
const { auth } = require('../middlewares/auth');
const { validateUserProfileUpdate } = require('../middlewares/validation');
const userController = require('../controllers/UserController');

const router = express.Router();

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, validateUserProfileUpdate, userController.updateProfile);

module.exports = router;