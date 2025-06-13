const incomeService = require('../services/incomeService');

const createIncome = async (req, res) => {
    try {
        const income = await incomeService.createIncome({
            ...req.body,
            userId: req.user.sub
        });
        res.status(201).json(income);
    } catch (error) {
        console.error('Error creating income:', error);
        res.status(500).json({ error: 'Failed to create income' });
    }
};

const getAllIncomes = async (req, res) => {
    try {
        const incomes = await incomeService.getAllIncomes(req.user.sub);
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ error: 'Failed to fetch incomes' });
    }
};

const updateIncome = async (req, res) => {
    try {
        const updatedIncome = await incomeService.updateIncome(req.params.id, {
            ...req.body,
            userId: req.user.sub
        });
        res.status(200).json(updatedIncome);
    } catch (error) {
        console.error('Error updating income:', error);
        res.status(500).json({ error: 'Failed to update income' });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const deleted = await incomeService.deleteIncome(req.params.id, req.user.sub);
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ error: 'Failed to delete income' });
    }
};

module.exports = { 
    createIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome
};  

