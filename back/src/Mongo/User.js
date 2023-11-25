const { BOOLEAN } = require("sequelize");
const connection = require("./db");

const UserSchema = new connection.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  email: String,
  gender: String,
  adress: String,
  city: String,
  zip: String,
  phone: String,
  dateofbirth: String,
  role: String,
  loginAttemps: Number,
  isVerified: Boolean,
  token: String,
  Orders: Array,
});

const User = new connection.model("User", UserSchema);

module.exports = User;
