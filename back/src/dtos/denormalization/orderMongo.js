const OrderMongo = require("../../Mongo/Order");

module.exports = async function (orderId, Order, User) {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: User,
      },
    ],
  });

  await OrderMongo.deleteOne({ _id: orderId });

  const orderMongo = new OrderMongo({
    _id: orderId,
    ...order.dataValues,
    User: order.dataValues.User.dataValues,
  });
  await orderMongo.save();
};
