const connection = require("./db");

const ProductSchema = new connection.Schema({
  _id: String,
  name: String,
  description: String,
  price: String,
  quantity: Number,
  image:String,
  state: String,
  promotion: Number,
  isPublished: Boolean,
  tva: Number,
  resolution: String,
  size: String,
  storage: String,
  loudspeaker: String,
  frontcamera: String,
  backcamera: String,
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
