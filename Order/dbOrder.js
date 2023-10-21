const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
  host: "localhost",
  dialect: "mysql",
});
const TVA = require("../Tva/dbTva");
const User = require("../auth/dbUser");

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

class Order extends Model {}
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    HT: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deliveryType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idTVA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tvas",
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "email",
      },
    },
  },
  {
    sequelize,
    modelName: "order",
  }
);
Order.belongsTo(TVA, { foreignKey: "idTVA" });
Order.belongsTo(User, { foreignKey: "email" });

module.exports = Order;
