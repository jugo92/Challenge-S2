const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");
const genericMongo = require("../dtos/denormalization/genericMongo");
const CategoryMongo = require("../Mongo/Category");

module.exports = function (connection) {
  class Category extends Model {
    static addHooks(db) {
      Category.addHook("afterCreate", category => {
        productMongo(
          category.id,
          "CategoryId",
          db.Product,
          db.Marque,
          db.Category
        );
        genericMongo(category.id, db.Category, CategoryMongo);
      });
      Category.addHook("afterUpdate", category => {
        productMongo(
          category.id,
          "CategoryId",
          db.Product,
          db.Marque,
          db.Category
        );
        genericMongo(category.id, db.Cateory, CategoryMongo);
      });
      Category.addHook("afterDestroy", category => {
        productMongo(
          category.id,
          "CategoryId",
          db.Product,
          db.Marque,
          db.Category
        );
        genericMongo(category.id, db.Category, CategoryMongo);
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
