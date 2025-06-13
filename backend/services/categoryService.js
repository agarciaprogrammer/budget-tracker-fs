const { Category, Expense } = require('../models');

const createCategory = async ({ name, userId }) => {
  return await Category.create({ name, userId });
};

const getAllCategories = async () => {
    return await Category.findAll({
        include: [{
            model: Expense,
            as: 'expenses'
        }]
    });
};

const updateCategory = async (id, data) => {
    const [updatedRowsCount, updatedRows] = await Category.update(data, {
        where: { id },
        returning: true,
    });
    return updatedRowsCount > 0 ? updatedRows[0] : null;
}

const deleteCategory = async (id) => {
    const deletedRowsCount = await Category.destroy({
        where: { id }
    });
    return deletedRowsCount > 0;
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};