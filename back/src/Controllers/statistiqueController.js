const StatistiqueTable = require("../Models/dbStatistique");
const { verifyRequestAttributes } = require("../core");

module.exports.getStatistiques = async (req, res) => {
  try {
    const query = StatistiqueTable.find();
    const statistiques = await query.exec();
    res.status(200).json(statistiques);
  } catch (err) {
    console.error("Erreur lors de la récupération des statistiques :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des statistiques" });
  }
};

module.exports.getStatistiqueByYearAndMonth = async (req, res) => {
  var statistique;
  try {
    if (req.params.month === undefined) {
      statistique = await StatistiqueTable.find({ year: req.params.year });
    } else {
      statistique = await StatistiqueTable.find({
        year: req.params.year,
        month: req.params.month,
      });
    }
    if (statistique === null) {
      res.status(404).json({ message: "Statistique non trouvée" });
      return;
    }
    res.status(200).json(statistique);
  } catch (err) {
    console.error("Erreur lors de la récupération de la statistique :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la statistique" });
  }
};

// module.exports.deleteStatistiqueById = async (req, res) => {
//     try {
//         const statistique = await StatistiqueTable.findByPk(req.params.id);
//         if (statistique === null) {
//             res.status(404).json({ message: 'Statistique non trouvée' });
//             return;
//         }
//         await statistique.destroy();
//         res.status(204).json(statistique);
//     } catch (err) {
//         console.error('Erreur lors de la suppression de la statistique :', err);
//         res.status(500).json({ message: 'Erreur lors de la suppression de la statistique' });
//     }
// }

module.exports.postStatistique = async (req, res) => {
  try {
    const areKeysValid = verifyRequestAttributes(StatistiqueTable, req);
    if (!areKeysValid) {
      res.status(400).json({ message: "La requête est erronée" });
      return;
    }
    const statistique = await StatistiqueTable.create(req.body);
    res.status(201).json(statistique);
  } catch (err) {
    console.error("Erreur lors de la création de la statistique :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la statistique" });
  }
};
