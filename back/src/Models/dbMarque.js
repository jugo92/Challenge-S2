const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");

module.exports = function (connection) {
  class Marque extends Model {
    static addHooks(db) {
      Marque.addHook("afterCreate", marque =>
        productMongo(
          marque.id,
          "MarqueId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        )
      );
      Marque.addHook("afterUpdate", marque =>
        productMongo(
          marque.id,
          "MarqueId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        )
      );
      Marque.addHook("afterDestroy", marque =>
        productMongo(
          marque.id,
          "MarqueId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        )
      );
    }
  }

  Marque.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "Marque",
    }
  );
  return Marque;
};
