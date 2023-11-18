const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Category extends Model {}

  Category.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Category",
    }
  );
  return Category;
};
