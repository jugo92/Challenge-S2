const router = require("express").Router();

const tvaController = require("../Controllers/tvaController");

router.get("/", tvaController.getTva);
router.post("/", tvaController.createTva);

module.exports = router;