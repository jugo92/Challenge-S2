function syncModel(model, message) {
  model
    .sync({
      // force: true,
    })
    .then(() => {
      console.log(message);
    });
}

const User = require("./auth/dbUser");
syncModel(User, "dbUser sync ok");

const Marque = require("./Marque/dbMarque");
syncModel(Marque, "dbMarque sync ok");

const Model = require("./Model/dbModel");
syncModel(Model, "dbModel sync ok");

const Tva = require("./Tva/dbTva");
syncModel(Tva, "dbTva sync ok");

const Product = require("./Product/dbProduct");
syncModel(Product, "dbProduct sync ok");

const Order = require("./Order/dbOrder");
syncModel(Order, "dbOrder sync ok");

const ProductOrder = require("./Order/dbProductOrder");
syncModel(ProductOrder, "dbProductOrder sync ok");

require("./Statistique/dbStatistique");
const Caracteristique = require("./caracteristique/dbCaract");
syncModel(Caracteristique, "dbCaract sync ok");
