
module.exports = (sequelize, DataTypes) => {
    const Expense = sequelize.define('Expense', {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        amount: {
        type: DataTypes.FLOAT,
        allowNull: false
        },
        description: {
        type: DataTypes.STRING,
        allowNull: true
        },
        date: {
        type: DataTypes.DATE,
        allowNull: false
        },
        categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        }
        }
    }, {
        tableName: 'expenses',
        timestamps: true
    });
    
    return Expense;
};
