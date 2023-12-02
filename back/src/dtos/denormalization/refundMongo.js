const RefundMongo = require("../../Mongo/Refund");
module.exports = async (refundId, Refund, User, Order) => {
  const refund = await Refund.findByPk(refundId, {
    include: [
      {
        model: Order,
      },
      {
        model: User,
      },
    ],
  });

  await RefundMongo.deleteOne({ _id: refundId });

  const refundMongo = new RefundMongo({
    _id: refundId,
    ...refund.dataValues,
    User: refund.dataValues.User.dataValues,
    Order: refund.dataValues.Order.dataValues,
  });
  await refundMongo.save();
};
