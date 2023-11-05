const OrderStatus = require("../Enum/orderStatus");
const Order = require("../Models/dbOrder");
const Product = require("../Models/dbProduct");
const ProductOrder = require("../Models/dbProductOrder");
const mongoose = require("mongoose");
module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Erreur lors de la récupération des commandes :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des commandes" });
  }
};

module.exports.getOrdersDetailsByUserId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.params.id,
        state: OrderStatus.VALIDATE,
      },
    });
    const details = await Promise.all(
      orders.map(async order => {
        const productOrders = await ProductOrder.findAll({
          where: {
            idOrder: order.id,
          },
        });

        const detailsProducts = await Promise.all(
          productOrders.map(async productOrder => {
            const product = await mongoose.models.products.findOne({
              id: productOrder.dataValues.idProduct,
              version: productOrder.dataValues.version,
            });

            return {
              name: product.nom,
              price: product.prix,
              quantity: productOrder.dataValues.quantity,
            };
          })
        );
        return detailsProducts;
      })
    );

    res.status(200).json(details);
  } catch (err) {
    console.error("Erreur lors de la récupération des commandes :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des commandes" });
  }
};
