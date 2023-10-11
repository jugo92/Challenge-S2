const genereFactures = require("../genereFactures"); 

module.exports.genereFactureById = async (req, res) => {
    try {
        const facture = await facture.findOne({ where: { id: req.params.id } });
        console.log(facture);
        await genereFactures.generateFacture(facture); 
        res.send(facture);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Error while getting facture" });
    }
}

// Pour la fonction de test
module.exports.genereFacture = async (req, res) => {
    try {
        const facture = await facture.findOne({ where: { id: 1 } });
        console.log(facture);
        await genereFactures.generateFacture(facture); 
        res.send(facture);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Error while getting facture" });
    }
}
