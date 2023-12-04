const connection = require("./db");

const StockHistorySchema = new connection.Schema({
  _id: String,
  movement: String,
  quantity: Number,
  Product: Object
});

const StockHistory = new connection.model("StockHistory", StockHistorySchema);

module.exports = StockHistory;
