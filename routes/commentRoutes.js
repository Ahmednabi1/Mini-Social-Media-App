const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to add a comment to a specific post
// router.post('/posts/:id/comments', authMiddleware, commentController.createComment);

module.exports = router;
