module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Category.associate = (models) => {
    Category.hasMany(models.Expense, { foreignKey: 'categoryId', as: 'expenses' });
    Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Category;
};
