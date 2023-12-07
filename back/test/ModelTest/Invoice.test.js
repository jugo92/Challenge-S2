const Invoice = require("../../src/Models/Invoice");

jest.mock("../../src/Models/Invoice", () => ({
    create: jest.fn(() => Promise.resolve({})),
        delete: jest.fn(() => Promise.resolve(1)),
        update: jest.fn(() => Promise.resolve({})),
        findAll: jest.fn(() => Promise.resolve({})),
        findByPk: jest.fn(() => Promise.resolve(null)),
    }));

describe('test des factures', () => {
    it('devrait créer une facture', async () => {
        const invoiceData = {
            id: 1,
            name: 'Test Invoice',
            description: 'A test Invoice',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newInvoice = await Invoice.create(invoiceData);

        expect(newInvoice).toBeDefined();
        expect(Invoice.create).toHaveBeenCalledWith(invoiceData);
    });

    it('devrait supprimer une facture', async () => {
        const deleteInvoice = await Invoice.delete(1);

        expect(deleteInvoice).toBe(1);
        expect(Invoice.delete).toHaveBeenCalledWith(1);
    });

    it('devrait mettre à jour une facture', async () => {
        const updateInvoice = await Invoice.update({
            id: 1,
            name: 'Updated Invoice',
            description: 'An updated Invoice',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(updateInvoice).toBeDefined();
        expect(Invoice.update).toHaveBeenCalledWith({
            id: 1,
            name: 'Updated Invoice',
            description: 'An updated Invoice',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    it('devrait ne pas trouver une facture', async () => {
        const notFoundInvoice = await Invoice.findByPk(2);

        expect(notFoundInvoice).toBeNull();
    });

}
);