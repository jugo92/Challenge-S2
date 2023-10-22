const router = require("express").Router();

const productController = require("../controller/productController");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);

module.exports = router;
