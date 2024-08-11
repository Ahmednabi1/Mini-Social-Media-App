'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'resetPasswordToken', {
      type: Sequelize.STRING
  });
  await queryInterface.addColumn('Users', 'resetPasswordExpires', {
      type: Sequelize.DATE
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'resetPasswordToken');
    await queryInterface.removeColumn('Users', 'resetPasswordExpires');
  }
};




//note : this is sensitive data so it's preferable to be stored in the database