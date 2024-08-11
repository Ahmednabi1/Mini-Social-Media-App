const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const Post = require('../models/post'); 
const Comment = require('../models/comment');
const User = require('../models/user');

router.get('/posts/new', authMiddleware, (req, res) => {
    res.render('post/index'); // Form for creating a post
});

router.post('/posts', authMiddleware, postController.createPost);

router.get('/posts/:id', postController.getPostDetails);

router.post('/posts/:id/comments', postController.addComment);

// Route to display all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: Comment, include: [{ model: User }] }]
        });
        res.render('post/list', { posts }); // Render a view with posts
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
