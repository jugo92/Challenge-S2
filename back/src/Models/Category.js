const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");
module.exports = function (connection) {
  class Category extends Model {
    static addHooks(db) {
      Category.addHook("afterCreate", category => {
        productMongo(
          category.id,
          "CategoryId",
          db.Product,
          db.Brand,
          db.Category,
          "update",
          db.Stock
        );
      });
      Category.addHook("afterUpdate", category => {
        productMongo(
          category.id,
          "CategoryId",
          db.Product,
          db.Brand,
          db.Category,
          "update",
          db.Stock
        );
      });
      Category.addHook("afterDestroy", category => {
        productMongo(
          null,
          "CategoryId",
          db.Product,
          db.Brand,
          db.Category,
          "destroy",
          db.Stock
        );
      });
    }
  }

  Category.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 1000], 
        },
      },
    },
    {
      sequelize: connection,
      tableName: "Category",
    }
  );
  return Category;
};
