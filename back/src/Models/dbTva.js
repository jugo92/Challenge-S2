const { Sequelize, Model, DataTypes } = require("sequelize");
module.exports = function (connection) {
  class Tva extends Model {}

  Tva.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      taux: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "tva",
    }
  );
  return Tva;
};
