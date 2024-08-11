'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', 
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'UserId');
  }
};
