const GenericController = require('../../src/Controllers/genericController');

describe('GenericController', () => {
  let mockService;
  let controller;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    controller = new GenericController(mockService);
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call the service getAll method', () => {
    controller.getAll(mockReq, mockRes);
    expect(mockService.getAll).toHaveBeenCalledWith(mockReq, mockRes);
  });

  it('should call the service getById method', () => {
    controller.getById(mockReq, mockRes);
    expect(mockService.getById).toHaveBeenCalledWith(mockReq, mockRes);
  });

    it('should call the service create method', () => {
        controller.create(mockReq, mockRes, mockNext);
        expect(mockService.create).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });
});