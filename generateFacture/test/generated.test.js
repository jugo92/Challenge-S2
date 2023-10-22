
const puppeteer = require('puppeteer');
const fs = require('fs');
const { generateFacture, calculateTotal } = require('../genereFactures'); 

describe('Test de la fonction generateFacture', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('génère un fichier PDF valide', async () => {
    const invoiceData = {
      numero: 1,
      date: '01/01/2021',
      client: {
        nom: 'Ady  Masivi',
        titre: 'M.',
        metier: 'ingenieur informatique',
        adresse: '1 rue de la Paix',
        codePostal: '75000',
        ville: 'Paris',
      },
      items: [
        {
          designation: 'Ordinateur',
          quantite: 1,
          prixUnitaireHT: 1000,
          tauxTVA: 20,
        },
        {
          designation: 'Imprimante',
          quantite: 1,
          prixUnitaireHT: 200,
          tauxTVA: 20,
        },
      ],
    };

    const pdfPath = 'facture_test.pdf'; 

   
    await generateFacture(invoiceData, pdfPath);

    const pdfExists = fs.existsSync(pdfPath);

    const pdfSize = fs.statSync(pdfPath).size;

    expect(pdfExists).toBe(true);
    expect(pdfSize).toBeGreaterThan(0);
  });

  it('calcule correctement le total', () => {
    const items = [
      {
        designation: 'Ordinateur',
        quantite: 1,
        prixUnitaireHT: 1000,
        tauxTVA: 20,
      },
      {
        designation: 'Imprimante',
        quantite: 1,
        prixUnitaireHT: 200,
        tauxTVA: 20,
      },
    ];

    const total = calculateTotal(items);
    expect(total).toBe('1440.00');
  });
});
