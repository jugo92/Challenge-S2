const connection = require("./db");

const OrderSchema = new connection.Schema({
  _id: String,
  HT: Number,
  state: String,
  User: Object,
});

const Order = new connection.model("Order", OrderSchema);

module.exports = Order;
