const router = require("express").Router();

const statistiqueController = require("../controller/statistiqueController");

router.get("/", statistiqueController.getStatistiques);
router.get("/:year/:month?", statistiqueController.getStatistiqueByYearAndMonth);
router.delete("/:id", statistiqueController.deleteStatistiqueById);
router.post("/", statistiqueController.postStatistique);

module.exports = router;