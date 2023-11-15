const fs = require("fs");
const path = require("path");

const connection = require("./db");

const db = {};
const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file === "db.js" || file === "index.js") return;
  if (
    file == "dbUser.js" ||
    file == "dbMarque.js" ||
    file == "dbTva.js" ||
    file == "dbOrder.js"
  ) {
    const model = require(path.join(__dirname, file))(connection);
    db[model.name] = model;
  }
});

for (const model in db) {
  if (model === connection) continue;
  if (db[model].associate) {
    db[model].associate(db);
  }
  if (db[model].addHooks) {
    db[model].addHooks(db);
  }
}

db.connection = connection;

module.exports = db;
