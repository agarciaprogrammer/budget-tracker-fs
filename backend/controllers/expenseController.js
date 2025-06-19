const eService = require('../services/expenseService');

const createExpense = async (req, res) => {
    try {
        console.log('Datos recibidos para crear gasto:', req.body);
        const expense = await eService.createExpense({
            ...req.body,
            userId: req.user.sub
        });
        console.log('Gasto creado:', expense);
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error al crear gasto:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await eService.getAllExpenses(req.user.sub);
        console.log('Gastos obtenidos:', expenses);
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error al obtener gastos:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Datos recibidos para actualizar gasto:', req.body);
        const updatedExpense = await eService.updateExpense(id, {
            ...req.body,
            userId: req.user.sub
        });
        console.log('Gasto actualizado:', updatedExpense);
        if (updatedExpense) {
            res.status(200).json(updatedExpense);
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        console.error('Error al actualizar gasto:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await eService.deleteExpense(id, req.user.sub);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
};