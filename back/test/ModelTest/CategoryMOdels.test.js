const Category = require("../../src/Models/Category")

jest.mock("../../src/Models/Category", () => ({
    create: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve(1)),
    update: jest.fn(() => Promise.resolve({})),
    findAll: jest.fn(() => Promise.resolve({})),
    findByPk: jest.fn(() => Promise.resolve(null)),
  }));

describe('test des catégories', () => {
    it('devrait créer une catégorie', async () => {
      const categoryData = await Category.create({
        id: 2,
        name: 'Test Category',
        description: 'A test category',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newCategory = await Category.create(categoryData);

      expect(newCategory).toBeDefined();
      expect(Category.create).toHaveBeenCalledWith(categoryData);
    });

    it('devrait supprimer une catégorie', async () => {
      const deleteCategory = await Category.delete(1);

      expect(deleteCategory).toBe(1);
      expect(Category.delete).toHaveBeenCalledWith(1);
    });

    it('devrait mettre à jour une catégorie', async () => {
        const categoryData = {
          id: 2,
          name: 'Updated Category',
          description: 'An updated category',
        };
        const updatedCategory = await Category.update(categoryData);
        expect(updatedCategory).toBeDefined();
        expect(Category.update).toHaveBeenCalledWith(expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
        }));
      });

    it('devrait ne pas trouver une catégorie', async () => {
      const notFoundCategory = await Category.findByPk(2);

      expect(notFoundCategory).toBeNull();
    });

  });