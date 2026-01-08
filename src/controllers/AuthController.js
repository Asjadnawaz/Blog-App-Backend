const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');
const { sendEmail } = require('../services/EmailService.js');

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

      if (result.success) {
        // Send welcome email
        await sendEmail({
          to: email,
          subject: '<b>Welcome to Asjad\'s Blog App!</b>',
          html: `<h2 style="color: #007bff;">Welcome ${firstName} to Asjad's Blog App!</h2><p style="color: #6c757d;">We are thrilled to have you as part of our community. We are excited to have you create and share your thoughts on various topics. Please feel free to read posts from other members of our community. We look forward to your contributions.</p>`,
        });
      }

      return this.successResponse(res, result, 'User registered successfully', 201);

      // Email Service


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

      if (result.success) {
        // Send login notification
        const emailResult = await sendEmail({
          to: email,
          subject: '<b>Login detected</b>',
          html: `<p style="color: red;">We have noticed a new login to your account. Please secure your account. If this was you, please ignore this message.</p>`,
        });
        console.log("Login email result: ", emailResult);
      }

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