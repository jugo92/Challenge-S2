const connection = require("./db");

const ProductSchema = new connection.Schema({
  _id: String,
  description: String,
  price: String,
  quantity: Number,
  state: String,
  promotion: Number,
  Marque: Object,
  Caracteristique: Object,
  Tva: Object,
  Category: Object,
});

const Product = new connection.model("Product", ProductSchema);

module.exports = Product;
