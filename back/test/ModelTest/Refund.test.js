const Refund = require("../../src/Models/Refund");


jest.mock("../../src/Models/Refund", () => ({
  create: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve(1)),
  update: jest.fn(() => Promise.resolve({})),
  findAll: jest.fn(() => Promise.resolve({})),
  findByPk: jest.fn(() => Promise.resolve(null)),
}));

describe('test des remboursements', () => {
  it('devrait créer un remboursement', async () => {
    const refundData = {
      id: 1,
      name: 'Test Refund',
      description: 'A test refund',
      createdAt: new Date('December 17, 1995 03:24:00'),
      updatedAt: new Date('December 17, 1995 03:24:00'),
    };

    const newRefund = await Refund.create(refundData);

    expect(newRefund).toBeDefined();
    expect(Refund.create).toHaveBeenCalledWith(refundData);
  });

  it('devrait supprimer un remboursement', async () => {
    const deleteRefund = await Refund.delete(1);

    expect(deleteRefund).toBe(1);
    expect(Refund.delete).toHaveBeenCalledWith(1);
  });

  it('devrait mettre à jour un remboursement', async () => {
    const updateRefund = await Refund.update({
      id: 1,
      name: 'Updated Refund',
      description: 'An updated refund',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(updateRefund).toBeDefined();
    expect(Refund.update).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Refund',
      description: 'An updated refund',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('devrait ne pas trouver un remboursement', async () => {
    const notFoundRefund = await Refund.findByPk(2);

    expect(notFoundRefund).toBeNull();
  });

});