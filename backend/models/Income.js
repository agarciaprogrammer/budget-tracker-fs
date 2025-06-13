module.exports = (sequelize, DataTypes) => {
    const Income = sequelize.define('Income', {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Income.associate = (models) => {
        Income.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Income;
};