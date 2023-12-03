const connection = require("./db");

const UserSchema = new connection.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  email: String,
  gender: String,
  address: String,
  city: String,
  zip: String,
  phone: String,
  dateofbirth: String,
  role: String,
  loginAttemps: Number,
  isVerified: Boolean,
  token: String,
  product_category_alert:Boolean,
  restock_product_alert: Boolean,
  change_price_alert : Boolean,
  newsletter_alert : Boolean,
  Orders: Array,
});

const User = new connection.model("User", UserSchema);

module.exports = User;
