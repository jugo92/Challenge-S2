const { Sequelize } = require("sequelize");

const connection = new Sequelize("challenge-s2", "user", "challenge-s2", {
  host: "localhost",
  dialect: "mysql",
});

connection
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("ERROR : ", err));

module.exports = connection;
