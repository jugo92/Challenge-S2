const express = require("express");
const router = express.Router();

const routePrefix = "/api";

const userRoute = require("./userRoute");
const caractRoute = require("./caractRoutes");
const core = require("../core");
// const factureRoute = require("./genereFactureRoute");
const marqueRoutes = require("./marqueRoutes");
const modelRoutes = require("./modelRoutes");
const tvaRoutes = require("./tvaRoutes");
const productRoutes = require("./productRoutes");
const statistiqueRoutes = require("./statistiqueRoutes");
const orderRoutes = require("./orderRoutes");
const models = require("../Models");

router.use(routePrefix, userRoute);

router.use(routePrefix, caractRoute);

// router.use(routePrefix, factureRoute);
router.use(routePrefix + "/marques", marqueRoutes);

router.use(routePrefix + "/models", modelRoutes);

router.use(routePrefix + "/tvas", tvaRoutes);

router.use(routePrefix + "/products", productRoutes);
core.generateCrud(models.Product, "products", router, true, true);

router.use(routePrefix + "/statistiques", statistiqueRoutes);

router.use(routePrefix + "/order", orderRoutes);
module.exports = router;
