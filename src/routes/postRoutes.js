const express = require('express');
const { auth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const {
  validateBlogPost,
  validatePagination
} = require('../middlewares/validation');
const postController = require('../controllers/PostController');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', validatePagination, (req, res, next) => postController.getAllPosts(req, res, next));
router.get('/:id', (req, res, next) => postController.getPostById(req, res, next));

// Protected routes (authentication required)
router.post('/', auth, upload.single('image'), validateBlogPost, (req, res, next) => postController.createPost(req, res, next));
router.put('/:id', auth, upload.single('image'), validateBlogPost, (req, res, next) => postController.updatePost(req, res, next));
router.delete('/:id', auth, (req, res, next) => postController.deletePost(req, res, next));

module.exports = router;