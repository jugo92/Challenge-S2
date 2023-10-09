const router = require("express").Router();

const productController = require("../controller/productController");

router.get("/", productController.getProducts);
// router.get("/:id", productController.getMarqueById);
// router.delete("/:id", productController.deleteMarqueById);
// router.post("/", productController.postMarque);

module.exports = router;