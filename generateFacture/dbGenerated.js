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

class PDFFile extends Model {}

PDFFile.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    contend: {
      type: DataTypes.BLOB,
    },
  },
  {
    sequelize,
    modelName: "PDFFile",
    tableName: "pdfFiles",
  }
);




