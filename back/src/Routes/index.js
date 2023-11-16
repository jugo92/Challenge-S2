const express = require("express");
const router = express.Router();

const routePrefix = "/api";

const userRoute = require("./userRoute");
router.use(routePrefix, userRoute);

module.exports = router;
