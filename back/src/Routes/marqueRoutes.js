const router = require("express").Router();

const marqueController = require("../Controllers/marqueController");

router.get("/", marqueController.getMarques);
router.get("/:id", marqueController.getMarqueById);
router.delete("/:id", marqueController.deleteMarqueById);
router.post("/", marqueController.postMarque);

module.exports = router;