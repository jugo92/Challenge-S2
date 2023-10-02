const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
  host: "mysqldb", 
  dialect: "mysql",
});
const User = require("./dbUser");

sequelize.authenticate()
  .then(() => {
    console.log("La connexion à la base de données a été établie avec succès.");
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la base de données :", error);
  });

class DeletedUserArchive extends Model {}
DeletedUserArchive.init(
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
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deletedUserId: {
      type: DataTypes.INTEGER, 
      references: {
        model: User, 
        key: "id", 
      },
    },
  },
  {
    sequelize,
    modelName: "deleted_user_archives",
    timestamps: false,
  }
);


module.exports = DeletedUserArchive;