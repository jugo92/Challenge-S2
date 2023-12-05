const OrderMongo = require("../../Mongo/Order");

module.exports = async function (orderId, Order, User, Invoice, ProductOrder, Product, Payment) {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: User,
      },
      {
        model : Payment
      },
      {
        model: Invoice,
      },
      {
        model: ProductOrder,
        include: [
          {
            model: Product,
          },
        ],
      },
    ],
  });

  await OrderMongo.deleteOne({ _id: orderId });

  const orderMongo = new OrderMongo({
    _id: orderId,
    ...order.dataValues,
    User: order.User?.dataValues,
    Invoice: order.Invoice?.dataValues || null,
    Payment: order.Payment?.dataValues || null,
    Products: order.ProductOrders.map(productOrder => {
      return {
        quantityOrdered: productOrder.quantity,
        id: productOrder.Product.id,
        name: productOrder.Product.name,
        price: productOrder.Product.price,
        state: productOrder.Product.state,
        quantity_refunded: productOrder.Product.quantity_refunded
      };
    }),
  });
  await orderMongo.save();
};
