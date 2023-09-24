const Modele = require("../dbModel");
const {verifyRequestAttributes} = require("../../core");

module.exports.getModeles = async (req, res) => {
    try {
        const modelesList = await Modele.findAll();
        res.status(200).json(modelesList);
    } catch (err) {
        console.error('Erreur lors de la récupération des modeles :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des modeles' });
    }
}

module.exports.getModeleById = async (req, res) => {
    try {
        const modele = await Modele.findByPk(req.params.id);
        if(modele === null) {
            res.status(404).json({ message: 'Modele non trouvée' });
            return;
        }
        res.status(200).json(modele);
    } catch (err) {
        console.error('Erreur lors de la récupération de la modele :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de la modele' });
    }
}

module.exports.deleteModeleById = async (req, res) => {
    try {
        const modele = await Modele.findByPk(req.params.id);
        if(modele === null) {
            res.status(404).json({ message: 'Modele non trouvée' });
            return;
        }
        await modele.destroy();
        res.status(204).json(modele);
    } catch (err) {
        console.error('Erreur lors de la suppression de la modele :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la modele' });
    }
}

module.exports.postModele = async (req, res) => {
    try {
        const areKeysValid = verifyRequestAttributes(Modele, req);
        if (!areKeysValid) {
            res.status(400).json({ message: 'La requête est erronée' });
            return;
        }
        const modele = await Modele.create(req.body);
        res.status(201).json(modele);
    } catch (err) {
        console.error('Erreur lors de la création de la modele :', err);
        res.status(500).json({ message: 'Erreur lors de la création de la modele' });
    }
}