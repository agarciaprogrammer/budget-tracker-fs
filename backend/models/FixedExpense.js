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
        date: {
            type: DataTypes.DATE,
            allowNull: false
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