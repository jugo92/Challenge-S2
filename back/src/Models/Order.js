const OrderStatus = require("../Enum/orderStatus");

const { DataTypes, Model } = require("sequelize");
const userMongo = require("../dtos/denormalization/userMongo");

module.exports = function (connection) {
  class Order extends Model {
    static associate(db) {
      Order.belongsTo(db.User);
      db.User.hasMany(Order);
    }
    static addHooks(db) {
      Order.addHook("afterCreate", async order => {
        userMongo(
          order.UserId,
          db.User,
          db.Order,
          db.ProductOrder,
          db.Product,
          db.Payment
        );
      });
      Order.addHook("afterUpdate", order =>
        userMongo(
          order.UserId,
          db.User,
          db.Order,
          db.ProductOrder,
          db.Product,
          db.Payment
        )
      );
    }
  }

  Order.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      HT: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deliveryAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deliveryType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM("Pending", "Validate", "Canceled"),
        defaultValue: "Pending",
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Order",
    }
  );

  return Order;
};
