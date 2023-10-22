const router = require("express").Router();

const tvaController = require("../controller/tvaController");

router.get("/", tvaController.getTva);
router.post("/", tvaController.createTva);

module.exports = router;