const Db = require('../../src/Models/db');

jest.mock('../../src/Models/db', () => ({
    connect: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
    }));

describe('test de la connexion à la base de données', () => {
    it('devrait se connecter à la base de données', async () => {
        await Db.connect();
        expect(Db.connect).toHaveBeenCalled();
    });

    it('devrait se déconnecter de la base de données', async () => {
        await Db.close();
        expect(Db.close).toHaveBeenCalled();
    });

    it('devrait ne pas se connecter à la base de données', async () => {
        Db.connect.mockRejectedValueOnce(new Error('Erreur de connexion'));
        await expect(Db.connect()).rejects.toThrow('Erreur de connexion');
    });  
},

);