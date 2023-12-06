const connection = require("./db");

const ProductSchema = new connection.Schema({
  _id: String,
  name: String,
  description: String,
  price: Number,
  image: String,
  state: String,
  promotion: Number,
  stock: Number,
  isPublished: Boolean,
  resolution: String,
  size: String,
  storage: String,
  loudspeaker: String,
  frontcamera: String,
  weight: String,
  width: String,
  height: String,
  battery: String,
  code: String,
  accesories: String,
  operatingSystem: String,
  cpu: String,
  gpu: String,
  Brand: Object,
  Category: Object,
});

const Product = new connection.model("Product", ProductSchema);

module.exports = Product;
