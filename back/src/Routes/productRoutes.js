const router = require("express").Router();

const productController = require("../Controllers/productController");
router.post("/createVersion", productController.createProductAndVersion);

module.exports = router;
