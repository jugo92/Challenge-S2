const MongoService = require('../../src/Services/mongoService');

function mockRequest(data) {
    return {
      params: data.params || {},
      query: data.query || {},
      body: data.body || {},
    };
}

function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res); 
    return res;
}

describe('MongoService', () => {
    let service;
    let modelMock;
    let consoleErrorMock;
  
    beforeEach(() => {
      modelMock = {
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
        countDocuments: jest.fn().mockReturnThis(),
        findById: jest.fn(),
      };
      service = new MongoService(modelMock);
      consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterEach(() => {
      consoleErrorMock.mockRestore();
    });
  
  
    describe('getById', () => {
        it('should return 404 if the model does not exist', async () => {
            const req = mockRequest({ params: { id: '1' } });
            const res = mockResponse();
        
            modelMock.findById.mockResolvedValue(null);
        
            await service.getById(req, res);
        
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 200 if the model exists', async () => {
            const req = mockRequest({ params: { id: '1' } });
            const res = mockResponse();
    
            modelMock.findById.mockResolvedValue({ id: '1', name: 'Model 1' });
    
            await service.getById(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Model 1' });
        });
    });
});