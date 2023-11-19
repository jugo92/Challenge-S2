const connection = require("./db");

const CategorySchema = new connection.Schema({
  _id: String,
  name: String,
  description: String,
});

const Category = new connection.model("Category", CategorySchema);

module.exports = Category;
