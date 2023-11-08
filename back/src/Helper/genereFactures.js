const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

function calculateTotal(items) {
    let total = 0;
    for (const item of items) {
        total += item.prixUnitaireHT * item.quantite * (1 + item.tauxTVA / 100);
    }
    return total.toFixed(2);
}

async function generateFacture(invoiceData) {
    const browser = await puppeteer.launch({ executablePath: 'chromium', args: ['--no-sandbox'] });

    console.log(await browser.version());

    const template = fs.readFileSync('./generateFacture/template/template.html', 'utf-8');
    const html = ejs.render(template, { invoice: invoiceData, calculateTotal: calculateTotal });

    const page = await browser.newPage();
    await page.setContent(html);

    const pdfPath = path.join(__dirname, `${invoiceData.name}`); 
    await page.pdf({
        path: pdfPath,
        format: 'A4',
    });

    await browser.close();

    return pdfPath;
}

const invoiceData = {
    name: "eChallenge_facture.pdf",
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

generateFacture(invoiceData)
    .then(pdfPath => {
        console.log(`PDF generated at ${pdfPath}`);
    })
    .catch(err => {
        console.error(err);
    });
