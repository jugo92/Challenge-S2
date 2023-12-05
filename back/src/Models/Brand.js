const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");

module.exports = function (connection) {
  class Brand extends Model {
    static addHooks(db) {
      Brand.addHook("afterCreate", brand => {
        productMongo(
          brand.id,
          "BrandId",
          db.Product,
          db.Brand,
          db.Category
        );
      });
      Brand.addHook("afterUpdate", brand => {
        productMongo(
          brand.id,
          "BrandId",
          db.Product,
          db.Brand,
          db.Category
        );
      });
      Brand.addHook("afterDestroy", brand => {
         productMongo(
          null,
          "BrandId",
          db.Product,
          db.Brand,
          db.Category,
          "destroy"
        );
      });
    }
  }

  Brand.init(
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
      tableName: "Brand",
    }
  );
  return Brand;
};
