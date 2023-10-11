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


// const customUserDataDir = path.join(__dirname, 'generateFacture', 'user_data');

async function generateFacture(invoiceData) {
    const template = fs.readFileSync('./generateFacture/template/template.html', 'utf-8');
    const html = ejs.render(template, { invoice: invoiceData, calculateTotal: calculateTotal });

    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
    });
    console.log(2);



    const page = await browser.newPage();
    await page.setContent(html);

    await page.pdf({
        path: `./invoices/invoice_${invoiceData.numero}.pdf`,
        format: 'A4',
    });

    await browser.close();
}

const invoiceData = {
    numero: 1,
    date: "01/01/2021",
    client: {
        nom: "John Doe",
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
    ],
};

generateFacture(invoiceData);
