const { Router } = require("express");

const router = Router();

const caractController = require("../controller/cractController");

router.get("/caract", caractController.getAllCaract);

router.get("/caract/:id", caractController.getCaractById);

router.post("/caract", caractController.CreateCaract);

router.put("/caract/:id", caractController.updateCaract);


router.delete("/caract/:id", caractController.deleteCaract);


module.exports = router;
