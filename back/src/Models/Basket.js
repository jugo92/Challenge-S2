const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Basket extends Model {
  }

  Basket.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      session_stripe_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "Basket",
    }
  );
  return Basket;
};
