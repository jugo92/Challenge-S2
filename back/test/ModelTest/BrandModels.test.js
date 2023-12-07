const Brand = require("../../src/Models/Brand");

jest.mock("../../src/Models/Brand", () => ({
  create: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve(1)),
}));

describe('Brand model', () => {
  it('should create a brand', async () => {
    const brandData = {
      id: 1,
      name: 'Test Brand',
      description: 'A test brand',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newBrand = await Brand.create(brandData);

    expect(newBrand).toBeDefined();
    expect(Brand.create).toHaveBeenCalledWith(brandData);
  });

    it('should delete a brand', async () => {
        const deleteBrand = await Brand.delete(1);
    
        expect(deleteBrand).toBe(1);
        expect(Brand.delete).toHaveBeenCalledWith(1);
    });
});