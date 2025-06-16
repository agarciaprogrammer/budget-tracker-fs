'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First rename the date column to startDate
    await queryInterface.renameColumn('FixedExpenses', 'date', 'startDate');

    // Then add the new columns
    await queryInterface.addColumn('FixedExpenses', 'lastPaymentDate', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('FixedExpenses', 'nextPaymentDate', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('FixedExpenses', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new columns
    await queryInterface.removeColumn('FixedExpenses', 'isActive');
    await queryInterface.removeColumn('FixedExpenses', 'nextPaymentDate');
    await queryInterface.removeColumn('FixedExpenses', 'lastPaymentDate');

    // Rename startDate back to date
    await queryInterface.renameColumn('FixedExpenses', 'startDate', 'date');
  }
};
