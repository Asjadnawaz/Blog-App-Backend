const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuthServiceInterface = require('./interfaces/AuthServiceInterface');

class AuthService extends AuthServiceInterface {
  /**
   * Register a new user
   */
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate JWT token
    const token = this.generateToken(savedUser._id, savedUser.role);

    return {
      user: this.sanitizeUser(savedUser),
      token
    };
  }

  /**
   * Authenticate user and return JWT token
   */
  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user._id, user.role);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId, role) {
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken) {
    // In a real implementation, you would have refresh tokens stored
    // For this implementation, we'll just verify the current token and generate a new one
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const newToken = this.generateToken(decoded.id, decoded.role);
      return { token: newToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user (in a real implementation, this might involve blacklisting the token)
   */
  async logout(token) {
    // For a simple implementation, we just return true
    // In a real app, you'd want to blacklist the token
    return true;
  }

  /**
   * Sanitize user object to remove sensitive information
   */
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  /**
   * Hash a password
   */
  async hashPassword(password) {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password, hash) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new AuthService();