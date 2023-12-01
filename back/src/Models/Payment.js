const { Model, DataTypes } = require("sequelize");
const PaymentStatus = require("../Enum/paymentStatus");
const paymentMongo = require("../dtos/denormalization/paymentMongo");

module.exports = function (connection) {
  class Payment extends Model {
    static associate(db) {
      db.Order.belongsTo(Payment);
      Payment.belongsTo(db.Order);
      Payment.belongsTo(db.User);
    }
    static addHooks(db) {
      Payment.addHook("afterCreate", async payment => {
        paymentMongo(payment.id, db.Payment, db.User);
      });
      Payment.addHook("afterUpdate", payment => {
        paymentMongo(payment.id, db.Payment, db.User);
      });
    }
  }

  Payment.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      session_stripe_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_stripe_id: {
        type: DataTypes.STRING,
        allowNull: true,
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
