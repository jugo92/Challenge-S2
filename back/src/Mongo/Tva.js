const connection = require("./db");

const TvaSchema = new connection.Schema({
  _id: String,
  rate: Number,
});

const Tva = new connection.model("Tva", TvaSchema);

module.exports = Tva;
