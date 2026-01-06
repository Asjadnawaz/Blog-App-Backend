const BlogPost = require('../models/BlogPost');
const PostServiceInterface = require('./interfaces/PostServiceInterface');

class BlogPostService extends PostServiceInterface {
  /**
   * Get all published blog posts with pagination
   */
  async getAllPosts(options = {}) {
    const { page = 1, limit = 10, published = true } = options;

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { published: published === true || published === 'true' };
    const total = await BlogPost.countDocuments(query);

    const posts = await BlogPost.find(query)
      .populate('author', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return {
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalPosts: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    };
  }

  /**
   * Get a specific blog post by ID
   */
  async getPostById(postId) {
    const post = await BlogPost.findById(postId).populate('author', 'firstName lastName email');

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  /**
   * Create a new blog post
   */
  async createPost(postData, authorId) {
    const { title, content, published = false, imageURL } = postData;

    const newPost = new BlogPost({
      title,
      content,
      author: authorId,
      published,
      imageURL
    });

    const savedPost = await newPost.save();
    return savedPost;
  }

  /**
   * Update a blog post
   */
  async updatePost(postId, updateData, userId, userRole) {
    const post = await BlogPost.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user is authorized to update this post
    if (userRole !== 'admin' && post.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this post');
    }

    // Update the post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      postId,
      { ...updateData },
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName email');

    return updatedPost;
  }

  /**
   * Delete a blog post
   */
  async deletePost(postId, userId, userRole) {
    const post = await BlogPost.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user is authorized to delete this post
    if (userRole !== 'admin' && post.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this post');
    }

    await BlogPost.findByIdAndDelete(postId);
    return true;
  }

  /**
   * Check if user can modify a post
   */
  async canModifyPost(postId, userId, userRole) {
    try {
      const post = await BlogPost.findById(postId);

      if (!post) {
        return false;
      }

      // Admins can always modify posts
      if (userRole === 'admin') {
        return true;
      }

      // Regular users can only modify their own posts
      return post.author.toString() === userId.toString();
    } catch (error) {
      return false;
    }
  }
}

module.exports = new BlogPostService();