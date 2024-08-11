const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Comment = require('./comment');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
Post.hasMany(Comment, { foreignKey: 'PostId' });
Comment.belongsTo(Post, { foreignKey: 'PostId' });
User.hasMany(Post, { foreignKey: 'UserId' });
Post.belongsTo(User, { foreignKey: 'UserId' }); //try id
module.exports = Post;



