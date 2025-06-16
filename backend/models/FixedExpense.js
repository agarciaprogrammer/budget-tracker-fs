module.exports = (sequelize, DataTypes) => {
    const FixedExpense = sequelize.define('FixedExpense', {
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
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        lastPaymentDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        nextPaymentDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    FixedExpense.associate = (models) => {
        FixedExpense.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return FixedExpense;
};