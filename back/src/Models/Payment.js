const { Model, DataTypes } = require("sequelize");
const StateStatus = require("../Enum/stateStatus");
const userMongo = require("../dtos/denormalization/userMongo");
const PaymentStatus = require("../Enum/paymentStatus");

module.exports = function (connection) {
  class Payment extends Model {
    static associate(db) {
      db.Order.belongsTo(Payment);
      Payment.belongsTo(db.Order);
    }
  }

  Payment.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      session_stripe_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
      },
      state: {
        type: DataTypes.ENUM("Pending", "Succeeded", "Failed"),
        defaultValue: "Pending",
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Payment",
    }
  );

  return Payment;
};
