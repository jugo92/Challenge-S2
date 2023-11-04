const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: Number,
    version: Number,
    nom: String,
    description: String,
    prix: Number,
    dateLivraison: Date,
    quantite: Number,
    image: String,
    marque: String,
    modele: String,
    etat: String,
    promotion: Boolean,
    numeroVersion: String,
    visible: Boolean,
    idTva: Number,
  },
  { timestamps: true }
);

const ProductVersionning = mongoose.model("products", productSchema);

module.exports = ProductVersionning;
