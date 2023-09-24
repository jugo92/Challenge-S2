const router = require("express").Router();

const modeleController = require("../controller/modelController");

router.get("/", modeleController.getModeles);
router.get("/:id", modeleController.getModeleById);
router.delete("/:id", modeleController.deleteModeleById);
router.post("/", modeleController.postModele);

module.exports = router;