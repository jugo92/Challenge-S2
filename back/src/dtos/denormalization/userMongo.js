const UserMongo = require("../../Mongo/User");

module.exports = async function (
  userId,
  User,
  Order,
  ProductOrder,
  Product,
  Payment,
  Invoice
) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Order,
        include: [
          {
            model: Payment,
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
      },
    ],
  });

  await UserMongo.deleteOne({ _id: userId });

  const userMongo = new UserMongo({
    _id: userId,
    ...user.dataValues,
    Orders: user.dataValues.Orders.map(order => {
      return {
        email: order.dataValues.email,
        status: order.dataValues.state,
        deliveryAddress: order.dataValues.deliveryAddress,
        address: order.dataValues.address,
        phone: order.dataValues.phone,
        zip: order.dataValues.zip,
        city: order.dataValues.city,
        Payment: order.dataValues.Payment?.dataValues,
        Invoice: order.dataValues.Invoice?.dataValues,
        Products: order.dataValues.ProductOrders.map(productOrder => {
          return {
            quantityOrdered: productOrder.dataValues.quantity,
            id: productOrder.dataValues.Product.dataValues.id,
            name: productOrder.dataValues.Product.dataValues.name,
            price: productOrder.dataValues.Product.dataValues.price,
            deliveryDate:
              productOrder.dataValues.Product.dataValues.deliveryDate,
            state: productOrder.dataValues.Product.dataValues.state,
          };
        }),
      };
    }),
  });
  await userMongo.save();
};
