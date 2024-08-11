const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('authApp', 'root', '.', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
