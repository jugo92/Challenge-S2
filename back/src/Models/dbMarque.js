const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Marque extends Model {}

  Marque.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "Marque",
    }
  );
  return Marque;
};
