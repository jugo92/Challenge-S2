function syncModel(model, message) {
  return model
    .sync({
      // force: true,
    })
    .then(() => {
      console.log(message);
    });
}

const User = require("./Models/dbUser");
const Marque = require("./Models/dbMarque");
const Model = require("./Models/dbModel");
const Tva = require("./Models/dbTva");
// const Generated = require("./generateFacture/dbGenerated");
const Product = require("./Models/dbProduct");
const Order = require("./Models/dbOrder");
const ProductOrder = require("./Models/dbProductOrder");
const Caracteristique = require("./Models/dbCaract");

Promise.all([
  syncModel(Tva, "dbTva sync ok"),
  syncModel(User, "dbUser sync ok"),
  syncModel(Marque, "dbMarque sync ok"),
  syncModel(Model, "dbModel sync ok"),
  // syncModel(Generated, "dbGenerated sync ok"),
  syncModel(Product, "dbProduct sync ok"),
  syncModel(Order, "dbOrder sync ok"),
  syncModel(ProductOrder, "dbProductOrder sync ok"),
  syncModel(Caracteristique, "dbCaract sync ok"),
])
  .then(() => {})
  .catch(error => {
    console.error("Erreur lors de la synchronisation des modèles :", error);
  });

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.error("Connexion à MongoDB réussie !"))
  .catch(err => console.error("Connexion à MongoDB échouée ! ", err));

require("./Models/dbProductVersionning");
