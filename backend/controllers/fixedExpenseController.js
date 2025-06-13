const fixedExpenseService = require('../services/fixedExpenseService');

const createFixedExpense = async (req, res) => {
    try {
    const fixedExpense = await fixedExpenseService.createFixedExpense({
        ...req.body,
        userId: req.user.sub
        });
        res.status(201).json(fixedExpense);
    } catch (error) {
        console.error('Error creating fixed expense:', error);
        res.status(500).json({ error: 'Failed to create fixed expense' });
    }
};

const getAllFixedExpenses = async (req, res) => {
    try {
        const fixedExpenses = await fixedExpenseService.getAllFixedExpenses(req.user.sub);
        res.status(200).json(fixedExpenses);
    } catch (error) {
        console.error('Error fetching fixed expenses:', error);
        res.status(500).json({ error: 'Failed to fetch fixed expenses' });
    }
};

const getFixedExpensesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const fixedExpenses = await fixedExpenseService.getAllFixedExpenses(userId);
        res.status(200).json(fixedExpenses);
    } catch (error) {
        console.error('Error fetching fixed expenses by user:', error);
        res.status(500).json({ error: 'Failed to fetch fixed expenses' });
    }
};

const updateFixedExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const fixedExpense = await fixedExpenseService.updateFixedExpense(id, {
            ...req.body,
            userId: req.user.sub
        });
        res.status(200).json(fixedExpense);
    } catch (error) {
        console.error('Error updating fixed expense:', error);
        res.status(500).json({ error: 'Failed to update fixed expense' });
    }
};

const deleteFixedExpense = async (req, res) => {
    const { id } = req.params;
    try {
        await fixedExpenseService.deleteFixedExpense(id, req.user.sub);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting fixed expense:', error);
        res.status(500).json({ error: 'Failed to delete fixed expense' });
    }
};

module.exports = {
    createFixedExpense,
    getAllFixedExpenses,
    getFixedExpensesByUserId,
    updateFixedExpense,
    deleteFixedExpense
};