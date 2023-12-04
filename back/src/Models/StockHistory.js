const { DataTypes, Model } = require("sequelize");
const stockMongo = require("../dtos/denormalization/stockMongo")
module.exports = function (connection) {
  class StockHistory extends Model {
    static associate(db) {
      StockHistory.belongsTo(db.Product);
      db.Product.hasMany(StockHistory);
    }
    static addHooks(db) {
      StockHistory.addHook("afterCreate", stock => {
        stockMongo(
          stock.id,
          db.StockHistory,
          db.Product
        );
      });
    }
  }

  StockHistory.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      movement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "La quantité doit être un nombre entier.",
          },
          min: {
            args: [1],
            msg: "La quantité ne peut pas être négative.",
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: "StockHistory",
    }
  );

  return StockHistory;
};
