const { Model, DataTypes } = require("sequelize");
const StateStatus = require("../Enum/stateStatus");
const productMongo = require("../dtos/denormalization/productMongo");

module.exports = function (connection) {
  class Product extends Model {
    static associate(db) {
      Product.belongsTo(db.Tva);
      Product.belongsTo(db.Marque);
      Product.belongsTo(db.Category);
      db.Marque.hasMany(Product);
      db.Caracteristique.hasMany(Product);
      db.Tva.hasMany(Product);
      db.Category.hasMany(Product);
      Product.belongsTo(db.Caracteristique);
    }
    static addHooks(db) {
      Product.addHook("afterCreate", product =>
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        )
      );
      Product.addHook("afterUpdate", product =>
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        )
      );
      Product.addHook("afterDestroy", product =>
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        )
      );
    }
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
        type: DataTypes.ENUM(
          "Neuf",
          "Reconditionne",
          "Occasion",
          "Seconde Main"
        ),
        defaultValue: StateStatus.NEUF,
        allowNull: false,
      },
      promotion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize: connection,
      tableName: "Product",
    }
  );

  return Product;
};
