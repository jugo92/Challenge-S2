const { Model, DataTypes } = require("sequelize");
module.exports = function (connection) {
  class Tva extends Model {}

  Tva.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Tva",
    }
  );
  return Tva;
};
