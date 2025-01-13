const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
    test('POST /api/add - Add a new cost', async () => {
        const response = await request(app).post('/api/add').send({
            userId: '123456',
            description: 'Groceries',
            sum: 100,
            category: 'Food',
            date: '2025-01-10',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
    });

    test('GET /api/report - Get monthly report', async () => {
        const response = await request(app).get(
            '/api/report?userId=123456&month=01&year=2025'
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/users/:id - Get user details', async () => {
        const response = await request(app).get('/api/users/123456');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('total');
    });
});
