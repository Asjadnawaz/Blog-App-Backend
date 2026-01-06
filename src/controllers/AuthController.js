const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');

class AuthController extends BaseController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const userData = {
        email,
        password,
        firstName,
        lastName
      };

      const result = await AuthService.register(userData);

      return this.successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      return this.errorResponse(res, error.message, 400);
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      return this.successResponse(res, result, 'Login successful');
    } catch (error) {
      return this.errorResponse(res, error.message, 401);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      // In a real implementation, you would handle token blacklisting
      // For this implementation, we just return a success message
      return this.successResponse(res, null, 'Logout successful');
    } catch (error) {
      return this.errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new AuthController();