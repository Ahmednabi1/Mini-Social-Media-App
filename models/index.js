// index.js
'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1)
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Handle model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Establish associations manually
const { User, Post, Comment } = db;

User.hasMany(Post, { foreignKey: 'UserId' });
Post.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Comment, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Post.hasMany(Comment, { foreignKey: 'PostId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'UserId' });
Comment.belongsTo(Post, { foreignKey: 'PostId' });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
