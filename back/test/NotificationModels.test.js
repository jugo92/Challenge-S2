const { models: { Notification } } = require("../src/Models/Notification");

jest.mock("../src/Models/Notification", () => {
  const originalSequelize = jest.requireActual('sequelize');

  return {
    ...originalSequelize,
    models: {
      Notification: {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })), 
        delete: jest.fn(id => Promise.resolve(id)), 
        update: jest.fn(data => Promise.resolve({ ...data })),
        findAll: jest.fn(() => Promise.resolve([])), 
        findByPk: jest.fn(id => Promise.resolve(null)), 
      },
    },
  };
});
  
  describe('test des notifications', () => {
    it('devrait créer une notification', async () => {
      const newNotification = await Notification.create({
        type: 1,
        name: "Test Notification",
      });
  
      expect(newNotification.id).toBeDefined();
    });
  
    it('devrait supprimer une notification', async () => {
      const deleteNotification = await Notification.delete(1);
  
      expect(deleteNotification).toBe(1);
    });
  
    it('devrait mettre à jour une notification', async () => {
      const updateNotification = await Notification.update({
        id: 1,
        type: 1,
        name: "Updated Notification",
      });
  
      expect(updateNotification).toBeDefined();
    });
  
    it('devrait ne pas trouver une notification', async () => {
      const notFoundNotification = await Notification.findByPk(2);
  
      expect(notFoundNotification).toBeNull();
    });
  
    it('devrait trouver une liste vide de notifications', async () => {
      const emptyNotificationList = await Notification.findAll();
  
      expect(emptyNotificationList).toHaveLength(0);
    });
  });
  