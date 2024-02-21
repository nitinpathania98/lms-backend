'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LeaveRequests', 'start-date', {
      type: Sequelize.DATE,
      allowNull: true, // Adjust this based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LeaveRequests', 'start-date');
  },
};
