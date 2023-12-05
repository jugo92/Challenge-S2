const PaymentMongo = require("../../Mongo/Payment");

module.exports = async function (paymentId, Payment, User, Invoice, Order) {
  const payment = await Payment.findByPk(paymentId, {
    include: [
      {
        model: User,
      },
      {
        model: Invoice
      },
      {
        model: Order
      }
    ],
  });

  await PaymentMongo.deleteOne({ _id: paymentId });

  const paymentMongo = new PaymentMongo({
    _id: paymentId,
    ...payment.dataValues,
    User: payment.User?.dataValues || null,
    Invoice: payment.Invoice?.dataValues || null,
    Order: payment.Order?.dataValues || null
  });
  await paymentMongo.save();
};
