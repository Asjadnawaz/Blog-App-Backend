/**
 * AuthServiceInterface
 *
 * Defines the contract for authentication services
 */
class AuthServiceInterface {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user object
   */
  async register(userData) {
    throw new Error('register method must be implemented');
  }

  /**
   * Authenticate user and return JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Authentication result with user and token
   */
  async login(email, password) {
    throw new Error('login method must be implemented');
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Promise<Object>} - Decoded token payload
   */
  async verifyToken(token) {
    throw new Error('verifyToken method must be implemented');
  }

  /**
   * Refresh JWT token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - New JWT token
   */
  async refreshToken(refreshToken) {
    throw new Error('refreshToken method must be implemented');
  }

  /**
   * Logout user (optional implementation for token blacklisting)
   * @param {string} token - JWT token to blacklist
   * @returns {Promise<boolean>} - Success status
   */
  async logout(token) {
    throw new Error('logout method must be implemented');
  }

  /**
   * Hash a password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  async hashPassword(password) {
    throw new Error('hashPassword method must be implemented');
  }

  /**
   * Verify a password against a hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} - Password match result
   */
  async verifyPassword(password, hash) {
    throw new Error('verifyPassword method must be implemented');
  }
}

module.exports = AuthServiceInterface;