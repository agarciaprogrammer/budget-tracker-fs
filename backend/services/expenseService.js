const { Expense } = require('../models');

const createExpense = async (data) => {
    return await Expense.create(data);
};

const getAllExpenses = async (userId) => {
    return await Expense.findAll({
        where: { userId }
    });
}

const updateExpense = async (id, data) => {
    const [updatedRowsCount, updatedRows] = await Expense.update(data, {
        where: { 
            id,
            userId: data.userId
        },
        returning: true
    });
    return updatedRowsCount ? updatedRows[0] : null;
};

const deleteExpense = async (id, userId) => {
    const deletedRows = await Expense.destroy({
        where: { 
            id,
            userId
        }
    });
    return deletedRows > 0;
};

module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
}; 