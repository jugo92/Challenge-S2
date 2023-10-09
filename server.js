const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
const port = process.env.PORT;
require("./db");
// require("./Statistique/dbStatistique");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('Connexion à MongoDB réussie !'))
//     .catch(() => console.log('Connexion à MongoDB échouée !'));

const routePrefix = "/api";

const userRoute = require("./auth/routes/userRoute");
app.use(routePrefix, userRoute);

const marqueRoutes = require("./Marque/routes/marqueRoutes");
app.use(routePrefix + "/marques", marqueRoutes);

const modelRoutes = require("./Model/routes/modelRoutes");
app.use(routePrefix + "/models", modelRoutes);

const tvaRoutes = require("./Tva/routes/tvaRoutes");
app.use(routePrefix + "/tvas", tvaRoutes);

const productRoutes = require("./Product/routes/productRoutes");
app.use(routePrefix + "/products", productRoutes);

const statistiqueRoutes = require("./Statistique/routes/statistiqueRoutes");
app.use(routePrefix + "/statistiques", statistiqueRoutes);

const stripeRoutes = require("./Stripe/routes/stripeRoutes");
app.use(routePrefix + "/stripe", stripeRoutes);

app.listen(port, () => {
  console.log(`Port d'écoute: ${port}`);
});