
const { models: { User } } = require("../../src/Models/User");

jest.mock("../../src/Models/User", () => {
  const originalSequelize = jest.requireActual('sequelize');

  return {
    ...originalSequelize,
    models: {
      User: {
        create: jest.fn(() => Promise.resolve({})),
        delete: jest.fn(()=> Promise.resolve({})),
        update: jest.fn(() => Promise.resolve({})),
        findAll: jest.fn(() => Promise.resolve({})),
        findByPk: jest.fn(() => Promise.resolve({})),
      },
    },
  };
});

describe('test des utilisateurs', () => {
    it('devrait créer un utilisateur', async () => {
      const twentyYearsAgo = new Date();
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
    
      const userData = {
        id: 1,
        firstName: 'Test User',
        lastName: 'Test User',
        email: 'test@test.com',
        password: 'test',
        gender: "H",
        birthDate: twentyYearsAgo,
        city: 'Test City',
        role: 'admin',
        isVerified: true,
        loginAttempts: 0,
        zip: 12345,
        address: 'Test Address',
        phone: 123456789,
      };
    
      User.create.mockResolvedValue(userData);
      const newUser = await User.create(userData);
    
      expect(newUser).toBeDefined();
      expect(newUser).toMatchObject(userData);
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining(userData));
    });
  
    it('devrait supprimer un utilisateur', async () => {
      User.delete.mockResolvedValue(1);
      const deleteUserData = await User.delete(1);
      
      expect(deleteUserData).toBe(1);
      expect(User.delete).toHaveBeenCalledWith(1);
    });
  
    it('ne devrait pas créer un utilisateur si l\'âge est inférieur à 20 ans', async () => {
      const nineteenYearsAgo = new Date();
      nineteenYearsAgo.setFullYear(nineteenYearsAgo.getFullYear() - 19);
    
      const userData = {
        id: 1,
        firstName: 'Test User',
        lastName: 'Test User',
        email: 'test@test.com',
        password: 'test',
        gender: "H",
        birthDate: nineteenYearsAgo,
        city: 'Test City',
        role: 'admin',
        isVerified: true,
        loginAttempts: 0,
        zip: 12345,
        address: 'Test Address',
        phone: 123456789,
      };
    
      User.create.mockRejectedValue(new Error('User must be at least 20 years old'));
      await expect(User.create(userData)).rejects.toThrow('User must be at least 20 years old');
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining(userData));
    });

    it('devrait mettre à jour un utilisateur', async () => {
        const twentyYearsAgo = new Date();
        twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
      
        const userData = {
          id: 1,
          firstName: 'Test User',
          lastName: 'Test User',
          email: 'test@test.com',
          password: 'test',
          gender: "H",
          birthDate: twentyYearsAgo,
          city: 'Test City',
          role: 'admin',
          isVerified: true,
          loginAttempts: 0,
          zip: 12345,
          address: 'Test Address',
          phone: 123456789,
        };
      
        const updatedUserData = {
          ...userData,
          firstName: 'Updated User',
        };
      
        User.update.mockResolvedValue([1, [updatedUserData]]);
        const [rowsUpdate, [updatedUser]] = await User.update(updatedUserData, {
          where: { id: userData.id }
        });
      
        expect(rowsUpdate).toBe(1);
        expect(updatedUser).toMatchObject(updatedUserData);
        expect(User.update).toHaveBeenCalledWith(updatedUserData, expect.objectContaining({
          where: { id: userData.id }
        }));
      });
            
  });