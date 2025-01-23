const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Cost = require('../models/cost');
const User = require('../models/user');

jest.setTimeout(30000); // 30 seconds timeout

beforeAll(async () => {
    await User.create({
        id: '123456',
        first_name: 'Chen',
        last_name: 'Hazum',
        birthday: '1995-01-01',
        marital_status: 'Single',
    });

    await Cost.create({
        userId: '123456',
        description: 'Groceries',
        sum: 150,
        category: 'Food',
        date: new Date(),
    });
});
afterAll(async () => {
    // Cleanup the database after tests
    await User.deleteMany({});
    await Cost.deleteMany({});
    mongoose.connection.close();
});

describe('API Tests - Cost Manager', () => {
    describe('POST /api/add', () => {
        it('should add a new cost item', async () => {
            const response = await request(app).post('/api/add').send({
                userId: '123456',
                description: 'Groceries',
                sum: 150,
                category: 'Food',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.description).toBe('Groceries');
        });

        it('should return an error when missing fields', async () => {
            const response = await request(app).post('/api/add').send({
                userId: '123456',
                sum: 150,
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('All fields are required');
        });
    });

    describe('GET /api/report', () => {
        it('should return all costs for a specific user and month', async () => {
            const response = await request(app).get('/api/report?userId=123456&month=01&year=2025');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return an error when missing parameters', async () => {
            const response = await request(app).get('/api/report?userId=123456&month=01');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('userId, month, and year are required');
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user details with total costs', async () => {
            const response = await request(app).get('/api/users/123456');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('first_name');
            expect(response.body).toHaveProperty('last_name');
            expect(response.body).toHaveProperty('total');
        });

        it('should return an error for a non-existent user', async () => {
            const response = await request(app).get('/api/users/999999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });
    });

    describe('GET /api/about', () => {
        it('should return the developers information', async () => {
            const response = await request(app).get('/api/about');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('first_name');
            expect(response.body[0]).toHaveProperty('last_name');
        });
    });
});
