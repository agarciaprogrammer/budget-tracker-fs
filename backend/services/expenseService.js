const { Expense } = require('../models/Expense');

const createExpense = async (data) => {
    return await Expense.create(data);
};

const getAllExpenses = async () => {
    return await Expense.findAll();
}

const updateExpense = async (id, data) => {
  const [updatedRowsCount, updatedRows] = await Expense.update(data, {
    where: { id },
    returning: true
  });
  return updatedRowsCount ? updatedRows[0] : null;
};

const deleteExpense = async (id) => {
  const deletedRows = await Expense.destroy({
    where: { id }
  });
  return deletedRows > 0;
};

module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
}; 