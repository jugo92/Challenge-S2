

function syncModel(model, message) {
  model.sync({
    // force: true
  }).then(() => {
    console.log(message);
  });
}

const User = require("./auth/dbUser");
syncModel(User, "dbUser sync ok");


const Marque = require("./Marque/dbMarque");
syncModel(Marque, "dbMarque sync ok");

const Model = require("./Model/dbModel");
syncModel(Model, "dbModel sync ok");

require("./Statistique/dbStatistique");

