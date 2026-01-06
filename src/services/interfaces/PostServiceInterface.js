/**
 * PostServiceInterface
 *
 * Defines the contract for blog post services
 */
class PostServiceInterface {
  /**
   * Get all published blog posts with pagination
   * @param {Object} options - Pagination and filtering options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10)
   * @param {boolean} options.published - Filter by published status (default: true)
   * @returns {Promise<Object>} - Paginated posts result
   */
  async getAllPosts(options = {}) {
    throw new Error('getAllPosts method must be implemented');
  }

  /**
   * Get a specific blog post by ID
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Blog post object
   */
  async getPostById(postId) {
    throw new Error('getPostById method must be implemented');
  }

  /**
   * Create a new blog post
   * @param {Object} postData - Post data
   * @param {string} authorId - Author ID
   * @returns {Promise<Object>} - Created blog post object
   */
  async createPost(postData, authorId) {
    throw new Error('createPost method must be implemented');
  }

  /**
   * Update a blog post
   * @param {string} postId - Post ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID making the update
   * @param {string} userRole - User role
   * @returns {Promise<Object>} - Updated blog post object
   */
  async updatePost(postId, updateData, userId, userRole) {
    throw new Error('updatePost method must be implemented');
  }

  /**
   * Delete a blog post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID making the deletion
   * @param {string} userRole - User role
   * @returns {Promise<boolean>} - Success status
   */
  async deletePost(postId, userId, userRole) {
    throw new Error('deletePost method must be implemented');
  }

  /**
   * Check if user can modify a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID
   * @param {string} userRole - User role
   * @returns {Promise<boolean>} - Permission status
   */
  async canModifyPost(postId, userId, userRole) {
    throw new Error('canModifyPost method must be implemented');
  }
}

module.exports = PostServiceInterface;