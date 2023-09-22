const { Sequelize, Model, DataTypes } = require("sequelize");
const Marque = require("../Marque/dbMarque");
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

class Modele extends Model { }
Modele.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idMarque: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'modele'
})

Modele.belongsTo(Marque, { foreignKey: 'idMarque' });

module.exports = Modele;