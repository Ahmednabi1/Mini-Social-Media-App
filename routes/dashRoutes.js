const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authMiddleware'); 
const Post = require('../models/post');
const Comment = require('../models/comment');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

router.get('/my-posts', ensureAuthenticated, async (req, res) => {
    try {
        const posts = await Post.findAll({ where: { UserId: req.session.userId } });
        res.render('my-posts', { posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/my-posts/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            res.render('edit-post', { post });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error('Error fetching post for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/my-posts/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            const { title, content } = req.body;
            await post.update({ title, content });
            res.redirect('/my-posts');
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/my-posts/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            await post.destroy();
            res.redirect('/my-posts');
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/my-comments', ensureAuthenticated, async (req, res) => {
    try {
        const comments = await Comment.findAll({ 
            where: { UserId: req.session.userId }, 
            include: [Post] 
        });
        res.render('my-comments', { comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/my-comments/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            res.render('edit-comment', { comment });
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        console.error('Error fetching comment for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/my-comments/:id', ensureAuthenticated, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            const { content } = req.body;
            await comment.update({ content });
            res.redirect('/my-comments');
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/my-comments/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            await comment.destroy();
            res.redirect('/my-comments');
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
