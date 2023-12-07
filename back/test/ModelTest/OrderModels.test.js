const Order = require("../../src/Models/Order");


jest.mock("../../src/Models/Order", () => ({
    create: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve(1)),
    update: jest.fn(() => Promise.resolve({})),
    findAll: jest.fn(() => Promise.resolve({})),
    findByPk: jest.fn(() => Promise.resolve(null)),
    }));

describe('test des commandes', () => {
    it('devrait créer une commande', async () => {
        const orderData = {
            id: 1,
            name: 'Test Order',
            description: 'A test order',
            createdAt: new Date('December 17, 1995 03:24:00'),
            updatedAt: new Date('December 17, 1995 03:24:00'),
        };

        const newOrder = await Order.create(orderData);

        expect(newOrder).toBeDefined();
        expect(Order.create).toHaveBeenCalledWith(orderData);
    });

    it('devrait supprimer une commande', async () => {
        const deleteOrder = await Order.delete(1);

        expect(deleteOrder).toBe(1);
        expect(Order.delete).toHaveBeenCalledWith(1);
    });

    it('devrait mettre à jour une commande', async () => {
        const updateOrder = await Order.update({
            id: 1,
            name: 'Updated Order',
            description: 'An updated order',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(updateOrder).toBeDefined();
        expect(Order.update).toHaveBeenCalledWith({
            id: 1,
            name: 'Updated Order',
            description: 'An updated order',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    it('devrait ne pas trouver une commande', async () => {
        const notFoundOrder = await Order.findByPk(2);

        expect(notFoundOrder).toBeNull();
    });

}
);