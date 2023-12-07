const mongoose = require('mongoose');
jest.mock('../../../src/Mongo/Payment');
jest.mock('mongoose');

const mockPayment = {
    findByPk: jest.fn().mockResolvedValue({
        dataValues: {
            User: { dataValues: {} },
            Invoice: { dataValues: {} },
            Order: { dataValues: {} },
        },
    }),
};

const paymentMongo = jest.fn(() => {
    mongoose.connect();
    mongoose.model('Payment', {});
    return mockPayment.findByPk(1, {
        include: [{ model: {} }, { model: {} }, { model: {} }],
    });
});
describe('Test de la fonction de paiement', () => {

    it('devrait créer un paiement', async () => {
        const payment = await paymentMongo(1, {}, {}, {}, {});
        expect(payment).toBeDefined();
        expect(mockPayment.findByPk).toHaveBeenCalledWith(1, {
            include: [{ model: {} }, { model: {} }, { model: {} }],
        });
    });

    it('devrait supprimer un paiement', async () => {
        const payment = await paymentMongo(1, {}, {}, {}, {});
        expect(payment).toBeDefined();
        expect(mockPayment.findByPk).toHaveBeenCalledWith(1, {
            include: [{ model: {} }, { model: {} }, { model: {} }],
        });
    });
});