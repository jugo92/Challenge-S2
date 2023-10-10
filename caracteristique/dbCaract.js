const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
    host: "mysqldb", 
    dialect: "mysql",
  });

  sequelize.authenticate()
  .then(() => {
    console.log("La connexion à la base de données a été établie avec succès.");
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la base de données :", error);
  });

class Caracteristique extends Model {}
Caracteristique.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resolution: {
      type: DataTypes.STRING,
    },

    size: {
      type: DataTypes.STRING,
    },

    storage: {
      type: DataTypes.STRING,
    },

   loudspeaker:{
     type: DataTypes.STRING,
   },
   frontcamera:{
     type: DataTypes.STRING,
   },
   backcamera:{
     type: DataTypes.STRING,
   },
   weight:{
     type: DataTypes.STRING,
   },
   width:{
    type: DataTypes.STRING,
  },
   height:{
     type: DataTypes.STRING,
    },
    battery:{
      type: DataTypes.STRING,
    },

    code:{
      type: DataTypes.STRING,
    },
    accesories:{
      type: DataTypes.STRING,
    },
    operatingSystem:{
      type: DataTypes.STRING,
    },
    cpu:{
      type: DataTypes.STRING,
    },
    gpu:{
      type: DataTypes.STRING,
    },

    
},
{
    sequelize,
    modelName: "caracteristiques",
  }
);

module.exports = Caracteristique;

