const StockHistory = require('../../src/Models/StockHistory');


jest.mock('../../src/Models/StockHistory', () => ({
    create: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve(1)),
    update: jest.fn(() => Promise.resolve({})),
    findAll: jest.fn(() => Promise.resolve({})),
    findByPk: jest.fn(() => Promise.resolve(null)),
}));

describe('test des historiques de stock', () => {
    it('devrait créer un historique de stock', async () => {
        const stockHistoryData = {
            id: 1,
            name: 'Test StockHistory',
            description: 'A test StockHistory',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newStockHistory = await StockHistory.create(stockHistoryData);

        expect(newStockHistory).toBeDefined();
        expect(StockHistory.create).toHaveBeenCalledWith(stockHistoryData);
    });

    it('devrait supprimer un historique de stock', async () => {
        const deleteStockHistory = await StockHistory.delete(1);

        expect(deleteStockHistory).toBe(1);
        expect(StockHistory.delete).toHaveBeenCalledWith(1);
    });

    it('devrait mettre à jour un historique de stock', async () => {
        const updateStockHistory = await StockHistory.update({
            id: 1,
            name: 'Updated StockHistory',
            description: 'An updated StockHistory',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(updateStockHistory).toBeDefined();
        expect(StockHistory.update).toHaveBeenCalledWith({
            id: 1,
            name: 'Updated StockHistory',
            description: 'An updated StockHistory',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    it('devrait ne pas trouver un historique de stock', async () => {
        const notFoundStockHistory = await StockHistory.findByPk(2);

        expect(notFoundStockHistory).toBeNull();
    });

}
);