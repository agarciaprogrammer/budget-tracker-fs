const { Category, Expense } = require('../models');

const createCategory = async ({ name, userId }) => {
  return await Category.create({ name, userId });
};

const getAllCategories = async (userId) => {
    return await Category.findAll({
        where: { userId },
        include: [{
            model: Expense,
            as: 'expenses'
        }]
    });
};

const updateCategory = async (id, data) => {
    const [updatedRowsCount, updatedRows] = await Category.update(data, {
        where: { 
            id,
            userId: data.userId
        },
        returning: true,
    });
    return updatedRowsCount > 0 ? updatedRows[0] : null;
}

const deleteCategory = async (id, userId) => {
    const deletedRowsCount = await Category.destroy({
        where: { 
            id,
            userId
        }
    });
    return deletedRowsCount > 0;
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};