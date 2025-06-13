import { FixedExpense } from '../models/index.js';

const createFixedExpense = async (fixedExpense) => {
    return await FixedExpense.create(fixedExpense);
};

const getAllFixedExpenses = async (userId) => {
    return await FixedExpense.findAll({ where: { userId } });
};

const updateFixedExpense = async (id, fixedExpense) => {
    return await FixedExpense.update(fixedExpense, { where: { id, userId: fixedExpense.userId } });
};

const deleteFixedExpense = async (id, userId) => {
    return await FixedExpense.destroy({ where: { id, userId } });
};

export {
    createFixedExpense,
    getAllFixedExpenses,
    updateFixedExpense,
    deleteFixedExpense
};