const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Caracteristique extends Model {}

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
