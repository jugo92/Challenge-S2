const router = require("express").Router();

const orderController = require("../controller/orderController");

router.get("/", orderController.getOrders);
// router.get("/:id", orderController.getProductById);
// router.delete("/:id", orderController.deleteProduct);
// router.post("/", orderController.createProduct);
// router.put("/:id", orderController.updateProduct);

module.exports = router;
