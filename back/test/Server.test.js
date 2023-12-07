
const http = require('http');

describe('Test des routes', () => {
  it('GET /api/users', async () => {
    const response = await new Promise(resolve => {
      http.get('http://localhost:3000/api/users', resolve);
    });

    expect(response.statusCode).toBe(200);
  });
});
