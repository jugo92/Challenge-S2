const StatistiqueTable = require("../dbStatistique");

module.exports.getStatistiques = async (req, res) => {
    try {
        const query = StatistiqueTable.find();
        const statistiques = await query.exec();
        res.status(201).json(statistiques);
    } catch (err) {
        console.error('Erreur lors de la récupération des statistiques :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
}

module.exports.getStatistiqueByYearAndMonth = async (req, res) => {
    try {
        if(req.params.month === undefined) {
            const statistique = await StatistiqueTable.find({year: req.params.year});
            res.status(201).json(statistique);
        }
        else {
            const statistique = await StatistiqueTable.find({year: req.params.year, month: req.params.month});
            res.status(201).json(statistique);
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la statistique :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de la statistique' });
    }
}

module.exports.deleteStatistiqueById = async (req, res) => {
    try {
        const statistique = await StatistiqueTable.findByPk(req.params.id);
        await statistique.destroy();
        res.status(201).json(statistique);
    } catch (err) {
        console.error('Erreur lors de la suppression de la statistique :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la statistique' });
    }
}

module.exports.postStatistique= async (req, res) => {
    try {
        const statistique = await StatistiqueTable.create(req.body);
        res.status(201).json(statistique);
    } catch (err) {
        console.error('Erreur lors de la création de la statistique :', err);
        res.status(500).json({ message: 'Erreur lors de la création de la statistique' });
    }
}