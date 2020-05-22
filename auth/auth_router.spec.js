const supertest = require('supertest');
const server = require('../api/server');

const db = require('../database/dbConfig');

describe('post /register', () => {
	it('should not register if no username and password entered', () => {
		db('users').truncate();
		return supertest(server).post('/api/auth/register').then((response) => {
			expect(response.status).toBe(400);
		});
	});
	it('should register if a username and password is entered', async () => {
		await db('users').truncate();
		await supertest(server)
			.post('/api/auth/register')
			.send({ username: 'test25', password: 'test25' })
			.then((response) => {
				expect(response.status).toBe(201);
			});
	});
});

describe('post /login', () => {
	it('should login and return code 200', () => {
		return supertest(server)
			.post('/api/auth/login')
			.send({ username: 'test25', password: 'test25' })
			.then((response) => {
				expect(response.status).toBe(200);
				console.log(response.body);
			})
			.catch((error) => {
				console.log(error);
			});
	});
	it('should return 400 if username is not correct', () => {
		return supertest(server).post('/api/auth/login').send({ username: '', password: '' }).then((response) => {
			expect(response.status).toBe(400);
		});
	});
});
