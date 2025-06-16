'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('FixedExpenses', 'date', 'startDate');
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
    await queryInterface.renameColumn('FixedExpenses', 'startDate', 'date');
    await queryInterface.removeColumn('FixedExpenses', 'lastPaymentDate');
    await queryInterface.removeColumn('FixedExpenses', 'nextPaymentDate');
    await queryInterface.removeColumn('FixedExpenses', 'isActive');
  }
};