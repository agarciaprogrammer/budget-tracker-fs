module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  User.associate = (models) => {
    User.hasMany(models.Expense, { foreignKey: 'userId', as: 'expenses' });
    User.hasMany(models.Category, { foreignKey: 'userId', as: 'categories' });
  };

  return User;
};
