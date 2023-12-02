const PaymentMongo = require("../../Mongo/Payment");

module.exports = async function (paymentId, Payment, User) {
  const payment = await Payment.findByPk(paymentId, {
    include: [
      {
        model: User,
      },
    ],
  });

  await PaymentMongo.deleteOne({ _id: paymentId });

  const paymentMongo = new PaymentMongo({
    _id: paymentId,
    ...payment.dataValues,
    User: payment.dataValues.User.dataValues,
  });
  await paymentMongo.save();
};
