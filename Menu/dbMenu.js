const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("challenge-s2", "user", "challenge-s2", {
    host: "localhost",
    dialect: "mysql",
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

class Menu extends Model { }
Menu.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    link: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    icon: {
        type: Sequelize.STRING(255),
    },
    parentId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: 'menu'
})

module.exports = Menu;
