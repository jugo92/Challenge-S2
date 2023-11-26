const fs = require("fs");
const path = require("path");
const easyinvoice = require("easyinvoice");
const { base64_encode } = require("../Helper/Utils");

class PdfService {
  constructor(pdfData) {
    let imgPath = path.resolve("img", "invoice.png");

    const dataGeneral = {
      images: {
        logo: `${base64_encode(imgPath)}`,
      },
      sender: {
        company: "Sample Corp",
        address: "Sample Street 123",
        zip: "1234 AB",
        city: "Sampletown",
        country: "Samplecountry",
      },
      settings: {
        currency: "EUR",
      },
    };
    this.pdfData = { ...pdfData, ...dataGeneral };
  }

  async invoicePdf() {
    let result = await easyinvoice.createInvoice(this.pdfData);
    fs.writeFileSync(`invoice/invoice_${this.pdfData.information.number}.pdf`, result.pdf, "base64");
  }
}

module.exports = PdfService;
