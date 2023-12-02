const connection = require("./db");

const PaymentSchema = new connection.Schema({
  _id: String,
  amount: Number,
  status: String,
  User: Object,
});

const Payment = new connection.model("Payment", PaymentSchema);

module.exports = Payment;
