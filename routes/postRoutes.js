const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// Form for creating a post
router.get('/posts/new', authMiddleware, (req, res) => {
    res.render('post/index');
});

// Create a post
router.post('/posts', authMiddleware, postController.createPost);

// View details of a post
router.get('/posts/:id', postController.getPostDetails);

// Add a comment to a post
router.post('/posts/:id/comments', postController.addComment);

// Get paginated list of posts
router.get('/posts', postController.getPosts);

module.exports = router;
