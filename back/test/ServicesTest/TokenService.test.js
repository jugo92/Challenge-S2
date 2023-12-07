const jwt = require('jsonwebtoken');
const { createToken, verifyToken } = require('../../src/Services/token');

describe('Token functions', () => {
  let user;
  let token;

  beforeAll(() => {
    user = {
      id: 1,
      firstname: 'ady',
      lastname: 'test',
      email: 'test@test.com'
    };
    jwt.sign = jest.fn(() => 'fakeToken');
    jwt.verify = jest.fn(() => user);

  });

  it('should create a token', () => {
    token = createToken(user);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
      }
    );
    expect(token).toBe('fakeToken');
  });

  it('should verify a token', () => {
    const decodedToken = verifyToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(decodedToken).toEqual(user);
  });

  it('should throw an error if token is invalid', () => {
    jwt.verify = jest.fn(() => {
      throw new Error();
    });
    expect(() => {
      verifyToken(token);
    }).toThrow();
  }
    );
});