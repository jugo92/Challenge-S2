const { verifyToken } = require("../../src/Services/token");
const checkAuth = require('../../src/Middlewares/checkAuth');

jest.mock("../../src/Services/token", () => ({
  verifyToken: jest.fn(),
}));

describe("checkAuth", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      path: '',
      user: null,
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if path is in excludePaths", () => {
    const middleware = checkAuth({ excludePaths: ['/exclude'] });
    req.path = '/exclude';
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should send 401 if no token is provided", () => {
    const middleware = checkAuth();
    middleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should set req.user and call next if token is valid", () => {
    const middleware = checkAuth();
    req.cookies.jwt = 'valid-token';
    verifyToken.mockReturnValueOnce({ id: 'user-id' });
    middleware(req, res, next);
    expect(req.user).toEqual({ id: 'user-id' });
    expect(next).toHaveBeenCalled();
  });
});