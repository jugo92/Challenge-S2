const Tva = require("../dbTva");

module.exports.getTva = async (req, res) => {
    try {
        const tva = await Tva.findOne();
        res.status(200).json(tva);
    } catch (err) {
        console.error('Erreur lors de la récupération de la TVA :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de la TVA' });
    }
}

module.exports.createTva = async (req, res) => {
    try {
        const { taux } = req.body;
        const tva = await Tva.create({ taux });
        res.status(201).json(tva);
    } catch (err) {
        console.error('Erreur lors de la création de la tva :', err);
        res.status(500).json({ message: 'Erreur lors de la création de la tva' });
    }
}
