const db = require('../../src/Models/index');

jest.mock('../../src/Models/index', () => ({
    connection: jest.fn(() => Promise.resolve()),
    }));

describe('test de la connexion à la base de données', () => {
    it('devrait se connecter à la base de données', async () => {
        await db.connection();
        expect(db.connection).toHaveBeenCalled();
    });

    it('devrait ne pas se connecter à la base de données', async () => {
        db.connection.mockRejectedValueOnce(new Error('Erreur de connexion'));
        await expect(db.connection()).rejects.toThrow('Erreur de connexion');
    });
    
}

);