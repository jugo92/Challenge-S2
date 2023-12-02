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
      amount: {
        type: DataTypes.FLOAT,
        validate: {
          min: {
            args: [0], 
            msg: 'Le montant ne peut pas être négatif.',
          },
          max: {
            args: [1000000], 
            msg: 'Le montant ne peut pas dépasser 1 000 000.',
          },
        },
      },
      status: {
        type: DataTypes.ENUM("Pending", "Succeeded", "Failed"),
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      sequelize: connection,
      tableName: "Payment",
    }
  );

  return Payment;
};
