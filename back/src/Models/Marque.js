const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");

module.exports = function (connection) {
  class Marque extends Model {
    static addHooks(db) {
      Marque.addHook("afterCreate", marque => {
        productMongo(
          marque.id,
          "MarqueId",
          db.Product,
          db.Marque,
          db.Category
        );
      });
      Marque.addHook("afterUpdate", marque => {
        productMongo(
          marque.id,
          "MarqueId",
          db.Product,
          db.Marque,
          db.Category
        );
      });
      Marque.addHook("afterDestroy", marque => {
         productMongo(
          null,
          "MarqueId",
          db.Product,
          db.Marque,
          db.Category,
          "destroy"
        );
      });
    }
  }

  Marque.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 255], 
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [2, 1000], 
        },
      },
    },
    {
      sequelize: connection,
      tableName: "Marque",
    }
  );
  return Marque;
};
