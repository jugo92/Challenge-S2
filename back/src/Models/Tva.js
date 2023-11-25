const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");
const genericMongo = require("../dtos/denormalization/genericMongo");
const TvaMongo = require("../Mongo/Tva");
module.exports = function (connection) {
  class Tva extends Model {
    static addHooks(db) {
      Tva.addHook("afterCreate", tva => {
        productMongo(
          tva.id,
          "TvaId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        );
        genericMongo(tva.id, db.Tva, TvaMongo);
      });
      Tva.addHook("afterUpdate", tva => {
        productMongo(
          tva.id,
          "TvaId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        );
        genericMongo(tva.id, db.Tva, TvaMongo);
      });
      Tva.addHook("afterDestroy", tva => {
        productMongo(
          tva.id,
          "TvaId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        );
        genericMongo(tva.id, db.Tva, TvaMongo);
      });
    }
  }

  Tva.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Tva",
    }
  );
  return Tva;
};
