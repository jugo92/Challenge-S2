const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
const port = process.env.PORT;
require("./db");
require("./Statistique/dbStatistique");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const marqueRoutes = require("./Marque/routes/marqueRoutes");
app.use("/marques", marqueRoutes);

const modelRoutes = require("./Model/routes/modelRoutes");
app.use("/models", modelRoutes);

const statistiqueRoutes = require("./Statistique/routes/statistiqueRoutes");
app.use("/statistiques", statistiqueRoutes);

app.get("/", (req, res) => {
  console.log("d");
});
console.log("test")

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Port d'écoute: ${port}`);
});