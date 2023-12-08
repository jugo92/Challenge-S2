const { Model, DataTypes } = require("sequelize");
const { uuidv7 } = require("uuidv7");
const productMongo = require("../dtos/denormalization/productMongo");

module.exports = function (connection) {
  class ProductBasket extends Model {
    static associate(db) {
      ProductBasket.belongsTo(db.Product);
      ProductBasket.belongsTo(db.Basket);
    }
    static addHooks(db) {
      ProductBasket.addHook("afterCreate", async productBasket => {
        await db.Stock.create({
          id: uuidv7(),
          movement: "reservation",
          quantity: productBasket.quantity,
          ProductId: productBasket.ProductId,
        },
        {  individualHooks: true }
        );
      });
    }
  }

  ProductBasket.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "La quantité doit être un nombre entier.",
          },
          min: {
            args: [0],
            msg: "La quantité ne peut pas être négative.",
          },
          max: {
            args: [1000],
            msg: "La quantité ne peut pas dépasser 1000.",
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: "ProductBasket",
    }
  );

  return ProductBasket;
};
