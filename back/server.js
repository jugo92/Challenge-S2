const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
const port = process.env.PORT;
require("./src/db");
const mainRoutes = require("./src/Routes");
// require("./Statistique/dbStatistique");

app.use(cors());
const routePrefix = "/api";

const stripeRoutes = require("./src/Routes/stripeRoutes");
app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(mainRoutes);

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('Connexion à MongoDB réussie !'))
//     .catch(() => console.log('Connexion à MongoDB échouée !'));

app.get("/failed", async (req, res) => {
  console.log("FAILED");
});

app.get("/success", async (req, res) => {
  console.log("SUCCESS");
  res.status(200).json({ message: "gg" });
});

app.listen(port, () => {
  console.log(`Port d'écoute: ${port}`);
});
