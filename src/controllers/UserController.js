const BaseController = require('./BaseController');
const User = require('../models/User');

class UserController extends BaseController {
  constructor() {
    super();
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }
  /**
   * Get user profile
   */
  async getProfile(req, res) {
    try {
      // User is already attached to req by auth middleware
      const user = req.user;

      return this.successResponse(res, user, 'User profile retrieved successfully');
    } catch (error) {
      return this.errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const { firstName, lastName } = req.body;

      // Find and update the user
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { firstName, lastName },
        { new: true, runValidators: true }
      ).select('-password'); // Don't return password

      if (!updatedUser) {
        return this.notFoundResponse(res, 'User not found');
      }

      return this.successResponse(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      return this.errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new UserController();