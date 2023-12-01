const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class ProductOrder extends Model {
    static associate(db) {
      ProductOrder.belongsTo(db.Order);
      db.Order.hasMany(ProductOrder);
      ProductOrder.belongsTo(db.Product);
      db.Product.hasMany(ProductOrder);
    }
  }

  ProductOrder.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      quantity: {
        type: DataTypes.INTEGER,
      },
      quantity_refunded: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize: connection,
      tableName: "ProductOrder",
    }
  );

  return ProductOrder;
};
