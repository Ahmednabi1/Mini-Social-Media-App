const Comment = require('../models/comment');
const Post = require('../models/post');
// Create a new comment
// exports.createComment = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const { content } = req.body

//         if (!req.session.userId) {
//             return res.status(403).send('Unauthorized');
//         }

//         await Comment.create({ //const comment =
//             content,
//             PostId: postId,
//             UserId: req.session.userId
//         });

//         res.redirect(`/posts/${postId}`);
//     } catch (error) {
//         console.error('Error creating comment:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };
