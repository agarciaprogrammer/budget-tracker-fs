import { Income } from '../models/index.js';

const createIncome = async (data) => {
    try {
        return await Income.create(data);
    } catch (error) {
        console.error('Error in createIncome service:', error);
        throw error;
    }
};

const getAllIncomes = async (userId) => {
    try {
        return await Income.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });
    } catch (error) {
        console.error('Error in getAllIncomes service:', error);
        throw error;
    }
};

const updateIncome = async (id, data) => {
    try {
        const [updatedRowsCount, updatedRows] = await Income.update(data, {
            where: { id, userId: data.userId },
            returning: true
        });
        return updatedRowsCount ? updatedRows[0] : null;
    } catch (error) {
        console.error('Error in updateIncome service:', error);
        throw error;
    }
};

const deleteIncome = async (id, userId) => {
    try {
        const deletedRows = await Income.destroy({
            where: { id, userId }
        });
        return deletedRows > 0;
    } catch (error) {
        console.error('Error in deleteIncome service:', error);
        throw error;
    }
};

export {
    createIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome
};