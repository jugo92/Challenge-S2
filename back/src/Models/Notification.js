const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Notification extends Model {
  }
  Notification.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Notification",
    }
  );
  return Notification;
};
