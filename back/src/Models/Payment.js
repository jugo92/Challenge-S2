const { Model, DataTypes } = require("sequelize");
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
        type: DataTypes.ENUM("Pending", "Succeeded", "Failed"),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
      },
    },
    {
      sequelize: connection,
      tableName: "Payment",
    }
  );

  return Payment;
};
