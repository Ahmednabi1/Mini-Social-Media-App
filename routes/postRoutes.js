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
  
router.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const commentsPerPage = 5;
    const commentPage = parseInt(req.query.commentPage) || 1;
    const commentOffset = (commentPage - 1) * commentsPerPage;

    try {
        const post = await Post.findByPk(postId, {
            include: [
                User, 
                {
                    model: Comment,
                    include: [User],
                    limit: commentsPerPage,
                    offset: commentOffset
                }
            ]
        });

        if (!post) {
            return res.status(404).send('Post not found');
        }

        const { count: totalComments } = await Comment.count({ where: { postId } });

        const totalCommentPages = Math.ceil(totalComments / commentsPerPage);
        res.render('post/detail', { post, currentCommentPage: commentPage, totalCommentPages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


router.post('/posts/:id/comments', postController.addComment);


// Route to get paginated list of posts
router.get('/posts', async (req, res) => {
    const postsPerPage = 5; 
    const page = parseInt(req.query.page) || 1; // Current page number
    const offset = (page - 1) * postsPerPage;

    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            limit: postsPerPage,
            offset: offset,
            include: [
                User,
                {
                    model: Comment,
                    include: [User] 
                }
            ],
            order: [['createdAt', 'DESC']] 
        });

        const totalPages = Math.ceil(count / postsPerPage); 
        res.render('post/list', { posts, currentPage: page, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
