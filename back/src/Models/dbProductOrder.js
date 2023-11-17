const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class ProductOrder extends Model {
    static associate(db) {
      ProductOrder.belongsTo(db.Order);
      db.Order.hasMany(ProductOrder);
      ProductOrder.belongsTo(db.Product);
      db.Product.hasMany(ProductOrder);
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
