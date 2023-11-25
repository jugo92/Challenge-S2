const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");
const genericMongo = require("../dtos/denormalization/genericMongo");
const CaracteristiqueMongo = require("../Mongo/Caracteristique");
module.exports = function (connection) {
  class Caracteristique extends Model {
    static addHooks(db) {
      Caracteristique.addHook("afterCreate", caracteristique => {
        productMongo(
          caracteristique.id,
          "CaracteristiqueId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        );
        genericMongo(
          caracteristique.id,
          db.Caracteristique,
          CaracteristiqueMongo
        );
      });
      Caracteristique.addHook("afterUpdate", caracteristique => {
        productMongo(
          caracteristique.id,
          "CaracteristiqueId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        );
        genericMongo(
          caracteristique.id,
          db.Caracteristique,
          CaracteristiqueMongo
        );
      });
      Caracteristique.addHook("afterDestroy", caracteristique => {
        productMongo(
          caracteristique.id,
          "CaracteristiqueId",
          db.Product,
          db.Caracteristique,
          db.Marque,
          db.Tva,
          db.Category
        );
        genericMongo(
          caracteristique.id,
          db.Caracteristique,
          CaracteristiqueMongo
        );
      });
    }
  }

  Caracteristique.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      resolution: {
        type: DataTypes.STRING,
      },

      size: {
        type: DataTypes.STRING,
      },

      storage: {
        type: DataTypes.STRING,
      },

      loudspeaker: {
        type: DataTypes.STRING,
      },
      frontcamera: {
        type: DataTypes.STRING,
      },
      backcamera: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.STRING,
      },
      width: {
        type: DataTypes.STRING,
      },
      height: {
        type: DataTypes.STRING,
      },
      battery: {
        type: DataTypes.STRING,
      },

      code: {
        type: DataTypes.STRING,
      },
      accesories: {
        type: DataTypes.STRING,
      },
      operatingSystem: {
        type: DataTypes.STRING,
      },
      cpu: {
        type: DataTypes.STRING,
      },
      gpu: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize: connection,
      tableName: "Caracteristique",
    }
  );

  return Caracteristique;
};
