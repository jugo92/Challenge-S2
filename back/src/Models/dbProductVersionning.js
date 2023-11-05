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
    modele: {
      id: Number,
      name: String,
      description: String,
      marque: {
        id: Number,
        name: String,
        description: String,
      },
    },
    etat: String,
    promotion: Boolean,
    version: String,
    visible: Boolean,
    tva: Number,
  },
  { timestamps: true }
);

const ProductVersionning = mongoose.model("products", productSchema);

module.exports = ProductVersionning;
