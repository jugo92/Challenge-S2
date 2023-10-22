const factures = require("../genereFactures");
const PDFFile = require("../dbGenerated");
const generatedFacture = require("../genereFactures"); 

module.exports.genereFactureById = async (req, res) => {
    try {
        const facture = await factures.findOne({ where: { id: req.params.id } });
        const pdfContent = await generatedFacture(facture); 

        const pdfFile = await PDFFile.create({
            name: `${facture.numero}.pdf`,
            content: pdfContent,
        });
   if(!pdfFile) {
            console.error("Erreur lors de la création de l'enregistrement PDFFile.");
            res.status(500).send({ error: "Error while saving PDF file" });
            return;
        }


        console.log("Fichier PDF sauvegardé avec succès dans la base de données.");

        res.send(facture);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Error while getting or generating facture" });
    }
}
//test withoud db 

module.exports.genereFacture = async (req, res) => {
    try {
        const invoiceData = {
            numero: 1,
            date: "01/01/2023",
            client: {
                nom: "Ady Masivi",
                titre: "M.",
                metier: "ingenieur informatique",
                adresse: "1 rue de la Paix",
                codePostal: "75000",
                ville: "Paris",
            },

            items: [
                {
                    designation: "Ordinateur",
                    quantite: 1,
                    prixUnitaireHT: 1000,
                    tauxTVA: 20,
                },
                {
                    designation: "Imprimante",
                    quantite: 1,
                    prixUnitaireHT: 200,
                    tauxTVA: 20,
                },
                {
                    designation: "Imprimante",
                    quantite: 1,
                    prixUnitaireHT: 200,
                    tauxTVA: 20,
                },
            ],
        };

        const pdfContent = await generatedFacture(invoiceData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=facture.pdf');
        const pdfPath =
        
        res.send(pdfContent);
    } catch (err) {
        console.error('Error generating facture:', err);
        res.status(500).send({ error: "Error while generating facture" });
    }
}

