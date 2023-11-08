const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("La connexion à la base de données a été établie avec succès.");
  })
  .catch(error => {
    console.error("Impossible de se connecter à la base de données :", error);
  });

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
      type: DataTypes.TEXT,
    },
    passwordSalt: {
      type: DataTypes.TEXT,
    },
    dateofbirth: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    sequelize,
    modelName: "users",
  }
);

module.exports = User;
