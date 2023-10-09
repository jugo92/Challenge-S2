const router = require("express").Router();

const stripeController = require("../controller/stripeController");

router.post("/create-checkout-session", stripeController.initPayment);

module.exports = router;