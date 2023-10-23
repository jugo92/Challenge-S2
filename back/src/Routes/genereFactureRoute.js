const { Router } = require("express");
const router = Router();
const {
  genereFactureById,
  genereFacture,
} = require("../Controllers/genereFactureController");

router.get("/genereFacture/:id", genereFactureById);

// Pour la fonction de test
router.get("/genereFacture", genereFacture);

module.exports = router;
