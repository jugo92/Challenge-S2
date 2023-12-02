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
        allowNull: false,
        validate: {
          isInt: {
            msg: 'La quantité doit être un nombre entier.',
          },
          min: {
            args: [0], 
            msg: 'La quantité ne peut pas être négative.',
          },
          max: {
            args: [1000], 
            msg: 'La quantité ne peut pas dépasser 1000.',
          },
        },
      },
      quantity_refunded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'La quantité rembourssé doit être un nombre entier.',
          },
          min: {
            args: [0], 
            msg: 'La quantité remboursé ne peut pas être négative.',
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: "ProductOrder",
    }
  );

  return ProductOrder;
};
