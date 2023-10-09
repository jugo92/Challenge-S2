const Product = require("../dbProduct");

module.exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        console.error('Erreur lors de la récupération des produits :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
}

// module.exports.getMarqueById = async (req, res) => {
//     try {
//         const marque = await Marque.findByPk(req.params.id);
//         if(marque === null) {
//             res.status(404).json({ message: 'Marque non trouvée' });
//             return;
//         }
//         res.status(200).json(marque);
//     } catch (err) {
//         console.error('Erreur lors de la récupération de la marque :', err);
//         res.status(500).json({ message: 'Erreur lors de la récupération de la marque' });
//     }
// }

// module.exports.deleteMarqueById = async (req, res) => {
//     try {
//         const marque = await Marque.findByPk(req.params.id);
//         if(marque === null) {
//             res.status(404).json({ message: 'Marque non trouvée' });
//             return;
//         }
//         await marque.destroy();
//         res.status(204).json(marque);
//     } catch (err) {
//         console.error('Erreur lors de la suppression de la marque :', err);
//         res.status(500).json({ message: 'Erreur lors de la suppression de la marque' });
//     }
// }

// module.exports.postMarque = async (req, res) => {
//     try {
//         const areKeysValid = verifyRequestAttributes(Marque, req);
//         if (!areKeysValid) {
//             res.status(400).json({ message: 'La requête est erronée' });
//             return;
//         }
//         const marque = await Marque.create(req.body);
//         res.status(201).json(marque);
//     } catch (err) {
//         console.error('Erreur lors de la création de la marque :', err);
//         res.status(500).json({ message: 'Erreur lors de la création de la marque' });
//     }
//}
