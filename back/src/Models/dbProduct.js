const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
  host: "localhost",
  dialect: "mysql",
});
const TVA = require("./dbTva");

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

class Product extends Model {}
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dateLivraison: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marque: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modele: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    etat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    promotion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    numeroVersion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idTVA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tvas",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "product",
  }
);
Product.belongsTo(TVA, { foreignKey: "idTVA" });

module.exports = Product;
