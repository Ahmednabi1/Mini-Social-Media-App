const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./post');
const User = require('./user');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
User.hasMany(Comment, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'UserId' });
module.exports = Comment;