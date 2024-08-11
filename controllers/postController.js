const Post = require('../models/post');
const User = require('../models/user'); 
const Comment = require('../models/comment');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.session.userId; 
        console.log("Session UserId:", req.session.userId);
        if (!userId) {
            req.flash('error_msg', 'You need to log in to create a post.');
            return res.redirect('/auth/login');
        }

        const newPost = await Post.create({
            title,
            content,
            UserId: userId 
        });

        res.redirect('/posts');
    } catch (error) {
        console.error('Error creating post:', error);
        req.flash('error_msg', 'An error occurred while creating the post.');
        res.status(500).send('Internal Server Error');
    }
};




exports.addComment = async (req, res) => {
    console.log("Session UserId:", req.session.userId);
    console.log("Comment Data:", req.body);
    console.log("Post ID:", req.params.id);
    console.log("User ID:", req.session.userId);

    if (!req.session.userId) {
        req.flash('error_msg', 'You need to log in to access this page.');
        return res.redirect('/auth/login');
    }

    try {
        const { content } = req.body; 
        const postId = req.params.id;
        const userId = req.session.userId;

        if (!content) {
            req.flash('error_msg', 'Comment content cannot be empty.');
            return res.redirect(`/posts/${postId}`);
        }

        await Comment.create({
            content: content,
            UserId: userId,
            PostId: postId
        });

        console.log('Comment created with content:', content, 'for post ID:', postId);
        res.redirect('/posts');
    } catch (error) {
        console.error('Error adding comment:', error);
        req.flash('error_msg', 'An error occurred while adding the comment.');
        res.status(500).send('Internal Server Error');
    }
};
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: Comment,
                    include: [User] 
                },
                User 
            ],
            order: [['createdAt', 'DESC']],
        });
        
        res.render('post/list', { posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getPostDetails = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                { model: Comment, include: [User] } 
            ]
        });

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('post/detail', { post, comments: post.Comments, user: req.session.user });
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).send('Internal Server Error');
    }
};