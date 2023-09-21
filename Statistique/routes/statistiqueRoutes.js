const router = require("express").Router();

const marqueController = require("../controller/statistiqueController");

router.get("/", marqueController.getStatistiques);
router.get("/:year/:month?", marqueController.getStatistiqueByYearAndMonth);
router.delete("/:id", marqueController.deleteStatistiqueById);
router.post("/", marqueController.postStatistique);

module.exports = router;