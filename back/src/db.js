function syncModel(model, message) {
  model
    .sync({
      // force: true,
    })
    .then(() => {
      console.log(message);
    });
}

const User = require("./Models/dbUser");
syncModel(User, "dbUser sync ok");

const Marque = require("./Models/dbMarque");
syncModel(Marque, "dbMarque sync ok");

const Model = require("./Models/dbModel");
syncModel(Model, "dbModel sync ok");

const Tva = require("./Models/dbTva");
syncModel(Tva, "dbTva sync ok");
// const Generated = require("./generateFacture/dbGenerated");
// syncModel(Generated, "dbGenerated sync ok");

require("./Models/dbStatistique");

const Product = require("./Models/dbProduct");
syncModel(Product, "dbProduct sync ok");

const Order = require("./Models/dbOrder");
syncModel(Order, "dbOrder sync ok");

const ProductOrder = require("./Models/dbProductOrder");
syncModel(ProductOrder, "dbProductOrder sync ok");

require("./Models/dbStatistique");
const Caracteristique = require("./Models/dbCaract");
syncModel(Caracteristique, "dbCaract sync ok");
