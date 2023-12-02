const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Invoice extends Model {
    static associate(db) {
      Invoice.belongsTo(db.Order);
      db.Order.belongsTo(Invoice);
    }
  }

  Invoice.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Invoice",
    }
  );

  return Invoice;
};
