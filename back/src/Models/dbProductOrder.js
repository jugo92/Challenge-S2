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
      version: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize: connection,
      tableName: "ProductOrder",
    }
  );

  return ProductOrder;
};
