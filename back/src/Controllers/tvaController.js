const Tva = require("../Models/dbTva");

module.exports.getTva = async (req, res) => {
  try {
    const tva = await Tva.findAll();
    res.status(200).json(tva);
  } catch (err) {
    console.error("Erreur lors de la récupération de la TVA :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la TVA" });
  }
};

module.exports.createTva = async (req, res) => {
  try {
    const tva = await Tva.create(req.body);
    res.status(201).json(tva);
  } catch (err) {
    console.error("Erreur lors de la création de la tva :", err);
    res.status(500).json({ message: "Erreur lors de la création de la tva" });
  }
};
