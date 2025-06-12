const eService = require('../services/expenseService');

const createExpense = async (req, res) => {
    try {
        const expense = await eService.createExpense(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await eService.getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedExpense = await eService.updateExpense(id, req.body);
        if (updatedExpense) {
            res.status(200).json(updatedExpense);
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await eService.deleteExpense(id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
};