const router = require("express").Router();
const bodyParser = require("body-parser");

const stripeController = require("../controller/stripeController");

router.post(
  "/create-checkout-session",
  bodyParser.json(),
  stripeController.initPayment
);

router.post(
  "/hooks",
  bodyParser.raw({ type: "application/json" }),
  stripeController.getEventPayment
);

module.exports = router;
