const router = require("express").Router();
const bodyParser = require("body-parser");

const stripeController = require("../Controllers/stripeController");
const checkAuth = require("../Middlewares/checkAuth");

router.post(
  "/create-checkout-session",
  bodyParser.json(),
  checkAuth(),
  stripeController.initPayment
);
router.post(
  "/refund",
  bodyParser.json(),
  stripeController.refundPayment
);

router.post(
  "/hooks",
  bodyParser.raw({ type: "application/json" }),
  stripeController.getEventPayment
);


module.exports = router;
