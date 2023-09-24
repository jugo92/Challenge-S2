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

class User extends Model {}
User.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    adress: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.STRING,

    },
    passwordSalt: {
      type: DataTypes.STRING,
    },
    dateofbirth: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
  },
  
  {
    sequelize,
    modelName: "users",
  }
);

module.exports = User;
