const { Model, DataTypes } = require("sequelize");
const StateStatus = require("../Enum/stateStatus");

module.exports = function (connection) {
  class Product extends Model {
    static associate(db) {
      Product.belongsTo(db.Tva);
      Product.belongsTo(db.Marque);
      db.Marque.hasMany(Product);
      Product.belongsTo(db.Caracteristique);
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

  Product.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: StateStatus.NEUF,
        allowNull: false,
      },
      promotion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "Product",
    }
  );

  return Product;
};
