
const { models: { Product } } = require("../src/Models/Product");

jest.mock("../src/Models/Product", () => {
  const originalSequelize = jest.requireActual('sequelize');

  return {
    ...originalSequelize,
    models: {
      Product: {
        create: jest.fn(() => Promise.resolve({})),
        delete: jest.fn(()=> Promise.resolve({})),
        update: jest.fn(() => Promise.resolve({})),
        findAll: jest.fn(() => Promise.resolve({})),
        findByPk: jest.fn(() => Promise.resolve({})),
      },
    },
  };
});

describe('test des produits', () => {
  it('devrait créer un produit', async () => {
  
    const productData = await Product.create({
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      price: 19.99,
      quantity: 10,
      quantity_alert: 5,
      isPublished: true,
      BrandId: 1,
      CategoryId: 1,
      state: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
      promotion: 0,
      resolution: 'HD',
      screen_size: 15,
      memory: 8,
      loudspeaker: true,
      frontcamera: true,
      weight: "1.5kg",
      with: "35cm",
      height: "25cm",
      battery: "12h",
      code: "123456789",
      accesories: "charger",
      operatingSystem: "Windows",
      cpu: "Intel",
      gpu: "Nvidia",
    });

    const newProduct = await Product.create(productData);

    expect(newProduct).toBeDefined();
    expect(Product.create).toHaveBeenCalledWith(productData);
    
});


it('devrait mettre à jour un produit', async () => {

    const productData = await Product.update({
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      price: 19.99,
      quantity: 10,
      quantity_alert: 5,
      isPublished: true,
      BrandId: 1,
      CategoryId: 1,
      state: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
      promotion: 0,
      resolution: 'HD',
      screen_size: 15,
      memory: 8,
      loudspeaker: true,
      frontcamera: true,
      weight: "1.5kg",
      with: "35cm",
      height: "25cm",
      battery: "12h",
      code: "123456789",
      accesories: "charger",
      operatingSystem: "Windows",
      cpu: "Intel",
      gpu: "Nvidia",
    });
    const updatedProduct = await Product.update(productData);

    expect(updatedProduct).toBeDefined();
    expect(Product.update).toHaveBeenCalledWith(productData);

});


it('devrait supprimer un produit', async () => {

  const productId = 1;
  const deletedProduct = await Product.delete(productId);

  expect(deletedProduct).toBeDefined();
  expect(Product.delete).toHaveBeenCalledWith(productId);
});

it('devrait récupérer tous les produits', async () => {

  const allProducts = await Product.findAll();

  expect(allProducts).toBeDefined();
  expect(Product.findAll).toHaveBeenCalled();
});

it('devrait récupérer un produit par son id', async () => {

  const productId = 1;
  const productById = await Product.findByPk(productId);

  expect(productById).toBeDefined();
  expect(Product.findByPk).toHaveBeenCalledWith(productId);

});

it('devrait récupérer une liste vide de produits', async () => {

  const emptyProductList = await Product.findAll();

  expect(emptyProductList).toBeDefined();
  expect(Product.findAll).toHaveBeenCalled();

});

});

  