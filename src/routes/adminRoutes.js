const express = require('express');
const { auth, authorize } = require('../middlewares/auth');
const postController = require('../controllers/PostController');

const router = express.Router();

// Admin routes for post management (only for admins)
router.get('/posts', auth, authorize('admin'), postController.getAllPosts);
router.put('/posts/:id', auth, authorize('admin'), postController.updatePost);
router.delete('/posts/:id', auth, authorize('admin'), postController.deletePost);

module.exports = router;