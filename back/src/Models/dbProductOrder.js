const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
  host: "localhost",
  dialect: "mysql",
});

const Order = require("./dbOrder");
const Product = require("./dbProduct");

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

class ProductOrder extends Model {}
ProductOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    idProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    version: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "productorder",
  }
);
ProductOrder.belongsTo(Order, { foreignKey: "idOrder" });
ProductOrder.belongsTo(Product, { foreignKey: "idProduct" });

module.exports = ProductOrder;
