const GenericService = require('../../src/Services/genericService'); 
const { mockRequest, mockResponse } = require('jest-mock-req-res'); 

describe('GenericService', () => {
  let service;
  let modelMock;

  beforeEach(() => {
    modelMock = {
      findAll: jest.fn(),
      count: jest.fn(),
    };
    service = new GenericService(modelMock);
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getAll', () => {
    it('should return models and set X-Total-Count', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      const models = [{ id: '1', name: 'Model 1' }, { id: '2', name: 'Model 2' }];
      const count = models.length;

      modelMock.findAll.mockResolvedValue(models);
      modelMock.count.mockResolvedValue(count);

      await service.getAll(req, res);

      expect(res.set).toHaveBeenCalledWith('X-Total-Count', count);
      expect(res.json).toHaveBeenCalledWith(models);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('doit retourner 500 si erreur ', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

        modelMock.findAll.mockRejectedValue();

      await service.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur interne du serveur' });
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

});