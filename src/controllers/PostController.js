const BaseController = require('./BaseController');
const BlogPost = require('../models/BlogPost');
const { uploadImageBuffer, deleteImage } = require('../utils/cloudinary');

class PostController extends BaseController {
  /**
   * Get all published blog posts
   */
  async getAllPosts(req, res) {
    try {
      const { page = 1, limit = 10, published = 'true' } = req.query;

      // Convert to numbers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const publishedBool = published === 'true';

      // Calculate skip value for pagination
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query = { published: publishedBool };
      const total = await BlogPost.countDocuments(query);

      const posts = await BlogPost.find(query)
        .populate('author', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return this.successResponse(res, {
        posts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalPosts: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return this.errorResponse(res, 'Error fetching posts', 500);
    }
  }

  /**
   * Get a specific blog post by ID
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;

      const post = await BlogPost.findById(id).populate('author', 'firstName lastName email');

      if (!post) {
        return this.notFoundResponse(res, 'Post not found');
      }

      // If post is not published and user is not authenticated as author or admin, return 404
      if (!post.published && (!req.user || (req.user._id.toString() !== post.author._id.toString() && req.user.role !== 'admin'))) {
        return this.notFoundResponse(res, 'Post not found');
      }

      return this.successResponse(res, post);
    } catch (error) {
      console.error('Error fetching post:', error);
      return this.errorResponse(res, 'Error fetching post', 500);
    }
  }

  /**
   * Create a new blog post
   */
  async createPost(req, res) {
    try {
      const { title, content } = req.body;
      const published = req.body.published === true || req.body.published === 'true';

      let imageURL = null;
      let imagePublicId = null;

      if (req.file) {
        const uploaded = await uploadImageBuffer(req.file.buffer, req.file.mimetype);
        imageURL = uploaded.secure_url;
        imagePublicId = uploaded.public_id;
      }

      // Create new blog post
      const newPost = new BlogPost({
        title,
        content,
        author: req.user._id,
        published,
        imageURL,
        imagePublicId
      });

      // Save to database
      const savedPost = await newPost.save();

      return this.successResponse(res, savedPost, 'Post created successfully', 201);
    } catch (error) {
      console.error('Error creating post:', error);
      return this.errorResponse(res, error.message || 'Error creating post', 500);
    }
  }

  /**
   * Update a blog post
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const published = req.body.published;

      // Find the post
      const post = await BlogPost.findById(id);

      if (!post) {
        return this.notFoundResponse(res, 'Post not found');
      }

      // Check if user is authorized to update this post
      if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
        return this.forbiddenResponse(res, 'Not authorized to update this post');
      }

      // Update the post
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (published !== undefined) updateData.published = (published === true || published === 'true');

      // Handle image replacement
      if (req.file) {
        // delete old image if exists
        if (post.imagePublicId) {
          try {
            await deleteImage(post.imagePublicId);
          } catch (e) {
            console.warn('Failed to delete old Cloudinary image:', e.message || e);
          }
        }

        const uploaded = await uploadImageBuffer(req.file.buffer, req.file.mimetype);
        updateData.imageURL = uploaded.secure_url;
        updateData.imagePublicId = uploaded.public_id;
      }

      const updatedPost = await BlogPost.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true, runValidators: true }
      ).populate('author', 'firstName lastName email');

      return this.successResponse(res, updatedPost, 'Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      return this.errorResponse(res, error.message || 'Error updating post', 500);
    }
  }

  /**
   * Delete a blog post
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;

      // Find the post
      const post = await BlogPost.findById(id);

      if (!post) {
        return this.notFoundResponse(res, 'Post not found');
      }

      // Check if user is authorized to delete this post
      if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
        return this.forbiddenResponse(res, 'Not authorized to delete this post');
      }

      if (post.imagePublicId) {
        try {
          await deleteImage(post.imagePublicId);
        } catch (e) {
          console.warn('Failed to delete Cloudinary image:', e.message || e);
        }
      }

      // Delete the post
      await BlogPost.findByIdAndDelete(id);

      return this.successResponse(res, null, 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      return this.errorResponse(res, error.message || 'Error deleting post', 500);
    }
  }
}

module.exports = new PostController();