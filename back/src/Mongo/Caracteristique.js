const connection = require("./db");

const CaracteristiqueSchema = new connection.Schema({
  _id: String,
  resolution: String,
  size: String,
  storage: String,
  loudspeaker: String,
  frontcamera: String,
  backcamera: String,
  weight: String,
  width: String,
  height: String,
  battery: String,
  code: String,
  accesories: String,
  operatingSystem: String,
  cpu: String,
  gpu: String,
});

const Caracteristique = new connection.model(
  "Caracteristique",
  CaracteristiqueSchema
);

module.exports = Caracteristique;
