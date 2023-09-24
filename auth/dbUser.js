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
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    adress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),

    },
    passwordSalt: {
      type: DataTypes.STRING(255),
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
