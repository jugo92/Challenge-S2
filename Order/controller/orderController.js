const Order = require("../dbOrder");

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
