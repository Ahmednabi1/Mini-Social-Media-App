const Post = require('../models/post');
const User = require('../models/user'); 
const Comment = require('../models/comment');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            req.flash('error_msg', 'You need to log in to create a post.');
            return res.redirect('/auth/login');
        }

        await Post.create({
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
    const userId = req.session.userId;
    const { content } = req.body;
    const postId = req.params.id;

    if (!userId) {
        req.flash('error_msg', 'You need to log in to access this page.');
        return res.redirect('/auth/login');
    }

    try {
        if (!content) {
            req.flash('error_msg', 'Comment content cannot be empty.');
            return res.redirect(`/posts/${postId}`);
        }

        await Comment.create({
            content,
            UserId: userId,
            PostId: postId
        });

        const currentPage = parseInt(req.query.page) || 1;
        let commentPage = parseInt(req.query.commentPage) || 1;

        const totalComments = await Comment.count({ where: { PostId: postId } });
        const commentsPerPage = 3;

        const totalCommentPages = Math.ceil(totalComments / commentsPerPage);

        if (commentPage > totalCommentPages) {
            commentPage = totalCommentPages;
        }

        res.redirect(`/posts?page=${currentPage}&commentPage=${commentPage}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        req.flash('error_msg', 'An error occurred while adding the comment.');
        res.status(500).send('Internal Server Error');
    }
};



exports.getPosts = async (req, res) => {
    const postsPerPage = 5;
    const commentsPerPage = 3;
    const page = parseInt(req.query.page) || 1;
    const commentPage = parseInt(req.query.commentPage) || 1;
    const offset = (page - 1) * postsPerPage;

    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            limit: postsPerPage,
            offset,
            include: [
                User,
                {
                    model: Comment,
                    include: [User],
                    limit: commentsPerPage,
                    offset: (commentPage - 1) * commentsPerPage,
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const totalPages = Math.ceil(count / postsPerPage);
        const commentPages = await Promise.all(
            posts.map(async post => {
                const commentCount = await Comment.count({ where: { PostId: post.id } });
                return Math.ceil(commentCount / commentsPerPage);
            })
        );

        res.render('post/list', {
            posts,
            currentPage: page,
            totalPages,
            currentCommentPage: commentPage,
            commentPages,
            commentsPerPage
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server error');
    }
};