const { Sequelize } = require("sequelize");
require('dotenv').config();

const connection = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

connection
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("ERROR : ", err));

module.exports = connection;
