const OrderStatus = require("../Enum/orderStatus");

const { DataTypes, Model } = require("sequelize");

module.exports = function (connection) {
  class Order extends Model {
    static associate(db) {
      Order.belongsTo(db.User);
      db.User.hasMany(Order);
      Order.belongsTo(db.Tva);
    }
    // static addHooks(db) {
    //   Article.addHook("afterCreate", (article) =>
    //     userMongo(article.UserId, db.User, db.Article)
    //   );
    //   Article.addHook("afterUpdate", (article) =>
    //     userMongo(article.UserId, db.User, db.Article)
    //   );
    //   Article.addHook("afterDestroy", (article) =>
    //     userMongo(article.UserId, db.User, db.Article)
    //   );
    // }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
        type: DataTypes.STRING,
        defaultValue: OrderStatus.PENDING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "order",
    }
  );

  return Order;
};
