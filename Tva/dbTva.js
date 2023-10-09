const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
    host: "mysqldb",
    dialect: "mysql",
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

class Tva extends Model { }
Tva.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      taux: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
}, {
    sequelize,
    modelName: 'tva'
})

module.exports = Tva;
