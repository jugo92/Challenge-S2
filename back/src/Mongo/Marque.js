const connection = require("./db");

const MarqueSchema = new connection.Schema({
  _id: String,
  name: String,
  image: String,
  description: String,
});

const Marque = new connection.model("Marque", MarqueSchema);

module.exports = Marque;
