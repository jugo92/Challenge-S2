const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dbTestAuth = require('./dbTestAuth');
const userRoute = require('../routes/userRoute'); 

const app = express();
app.use('/api/users', userRoute);

describe('User API Route Tests', () => {
  beforeAll(async () => {
    await dbTestAuth.connect(); 
  });

  afterAll(async () => {
    await dbTestAuth.disconnect(); 
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'test@tes.fr',
      password: 'test1234',
      adress: '123 rue test',
      city: 'test city',
      zip: '123456',
      phone: 'test',
      dateofbirth: 'test',
      role: 'test',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

 it("should connected a user", async () => {
    const userData = {
      email: "test@tes.fr",
      password: "test1234",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("greatens");
  }
  );
});
