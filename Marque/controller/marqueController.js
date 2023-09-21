const Marque = require("../dbMarque");

module.exports.getMarques = async (req, res) => {
    try {
        const marquesList = await Marque.findAll();
        console.log(marquesList);
        res.status(201).json(marquesList);
    } catch (err) {
        console.error('Erreur lors de la récupération des marques :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des marques' });
    }
}

module.exports.getMarqueById = async (req, res) => {
    try {
        const marque = await Marque.findByPk(req.params.id);
        res.status(201).json(marque);
    } catch (err) {
        console.error('Erreur lors de la récupération de la marque :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de la marque' });
    }
}

module.exports.deleteMarqueById = async (req, res) => {
    try {
        const marque = await Marque.findByPk(req.params.id);
        await marque.destroy();
        res.status(201).json(marque);
    } catch (err) {
        console.error('Erreur lors de la suppression de la marque :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la marque' });
    }
}

// module.exports.postMarque = async (req, res) => {
//     try {
//         const marque = await Marque.create(req.body);
//         res.status(201).json(marque);
//     } catch (err) {
//         console.error('Erreur lors de la création de la marque :', err);
//         res.status(500).json({ message: 'Erreur lors de la création de la marque' });
//     }
// }