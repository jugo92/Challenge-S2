const connection = require("./db");

const OrderSchema = new connection.Schema({
  _id: String,
  TTC: Number,
  status: String,
  email: String,
  address: String,
  city: String,
  zip: String,
  phone: String,
  tracking_number: String,
  User: Object,
});

const Order = new connection.model("Order", OrderSchema);

module.exports = Order;
