const NotificationUser = require("../../src/Models/NotificationUser");


jest.mock("../../src/Models/NotificationUser", () => ({
    create: jest.fn(() => Promise.resolve({})),
    destroy: jest.fn(() => Promise.resolve(1)), 
}));

describe('NotificationUser model', () => {
    it('should create a notificationUser', async () => {
        const notificationUserData = {
            id: 1,
            name: 'Test NotificationUser',
            description: 'A test notificationUser',
          
        };

        const newNotificationUser = await NotificationUser.create(notificationUserData);

        expect(newNotificationUser).toBeDefined();
        expect(NotificationUser.create).toHaveBeenCalledWith(notificationUserData);
    });


    it('should delete a notificationUser', async () => {
        const deleteNotificationUser = await NotificationUser.destroy({ where: { id: 1 } }); 
    
        expect(deleteNotificationUser).toBe(1);
        expect(NotificationUser.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

   

});
