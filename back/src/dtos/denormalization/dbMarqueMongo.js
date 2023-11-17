const mongoose = require("mongoose");

const MarqueSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
});

const Marque = mongoose.model("marques", MarqueSchema);

module.exports = Marque;
