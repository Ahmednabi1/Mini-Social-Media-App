const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/posts/new', authMiddleware, (req, res) => {
    res.render('post/index');
});

router.post('/posts', authMiddleware, postController.createPost);

router.post('/posts/:id/comments', postController.addComment);

router.get('/posts', postController.getPosts);

module.exports = router;
