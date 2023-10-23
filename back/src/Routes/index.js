const express = require("express");
const router = express.Router();

const routePrefix = "/api"; // Définissez votre préfixe de route ici

const userRoute = require("./userRoute");
const caractRoute = require("./caractRoutes");
// const factureRoute = require("./genereFactureRoute");
const marqueRoutes = require("./marqueRoutes");
const modelRoutes = require("./modelRoutes");
const tvaRoutes = require("./tvaRoutes");
const productRoutes = require("./productRoutes");
const statistiqueRoutes = require("./statistiqueRoutes");
const orderRoutes = require("./orderRoutes");

router.use(routePrefix, userRoute);
router.use(routePrefix, caractRoute);
// router.use(routePrefix, factureRoute);
router.use(routePrefix + "/marques", marqueRoutes);
router.use(routePrefix + "/models", modelRoutes);
router.use(routePrefix + "/tvas", tvaRoutes);
router.use(routePrefix + "/products", productRoutes);
router.use(routePrefix + "/statistiques", statistiqueRoutes);
router.use(routePrefix + "/order", orderRoutes);

module.exports = router;
