const connection = require("./db");

const RefundSchema = new connection.Schema({
  _id: String,
  motif: String,
  accepted: Boolean,
  amount_refund: Number,
  motif_accept_refund: String,
  motif_refused_refund: String,
});

const Refund = new connection.model("Refund", RefundSchema);

module.exports = Refund;
