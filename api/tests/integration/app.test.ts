import { afterEach, beforeEach, describe, expect, mock, spyOn, test, jest } from 'bun:test'
import request from 'supertest'
import app from '@src/server';
import { AuthController } from '@src/controllers/AuthController';
import { prisma } from '@src/config/prisma';

describe('Authentication - Create Account', () => {
    test('should display validation errors when form is empty', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({})

        // Act
        const createAccountMock = spyOn(AuthController, "createAccount");

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled();

    })

    test('should return 400 status code when the email is invalid', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                name: 'John Doe',
                email: 'invalid-email',
                password: 'password',
            })

        // Act
        const createAccountMock = spyOn(AuthController, "createAccount");

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe('invalid-email')

        expect(response.status).not.toBe(201)
        expect(createAccountMock).not.toHaveBeenCalled();
    }
    );

    test('should return 400 status code when the password is less than 8 characters', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                'name': 'John Doe',
                'email': 'test@mail.com',
                'password': 'pass'
            })

        // Act
        const createAccountMock = spyOn(AuthController, "createAccount");

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe('pass')

        expect(response.status).not.toBe(201)
        expect(createAccountMock).not.toHaveBeenCalled();
    })

    test('should register a new user successfully', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                'name': 'John Doe',
                'email': 'test@mail.com',
                'password': 'password'
            })


        // Assert
        expect(response.statusCode).toBe(201);
        expect(response.body).toBe('Cuenta Creada Correctamente')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })

    test('should return 409 conflict when a user is already registered', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                'name': 'John Doe',
                'email': 'test@mail.com',
                'password': 'password'
            })

        // Assert
        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Un usuario con ese email ya esta registrado')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')
    })
});

describe('Authentication - Account Confirmation with Token', () => {
    test('should display error if token is empty or token is not valid', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/confirm-account')
            .send({
                token: "not_valid"
            })

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Token no válido')

        expect(response.status).not.toBe(200)

    })

    test('should display error if token doesnt exists', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/confirm-account')
            .send({
                token: "123456"
            })

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Token no válido')

        expect(response.status).not.toBe(200)
    })

    test('should confirm account with a valid token', async () => {
        // Arrange
        const token = globalThis.cashTrackrConfirmationToken
        const response = await request(app)
            .post('/api/auth/confirm-account')
            .send({
                token
            })

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toBe('Cuenta confirmada correctamente')
        expect(response.status).not.toBe(401)
    })
})

describe('Authentication - Login', () => {
    test('should display validation errors when the form is empty', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/login')
            .send({})

        // Act
        const loginMock = spyOn(AuthController, 'login')

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(200)
        expect(loginMock).not.toHaveBeenCalled()
    })

    test('should return 400 bad request when the email is invalid', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'invalid-email',
                password: 'password'
            })

        // Act
        const loginMock = spyOn(AuthController, 'login')

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Email no válido')

        expect(response.status).not.toBe(200)
        expect(loginMock).not.toHaveBeenCalled()
    })

    test('should return a 400 error if the user is not found', async () => {
        // Arrange
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "password": "password",
                "email": "user_not_found@test.com"
            })

        // Assert
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Usuario no encontrado')

        expect(response.status).not.toBe(200)
    })

    test('should return a 403 error if the user account is not confirmed', async () => {
        // Arrange
        const findUniqueMock = spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
            id: 1,
            name: 'Test User',
            email: 'user_not_confirmed@test.com',
            password: 'hashedpassword',
            token: 'sometoken',
            confirmed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Act
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "password": "password",
                "email": "user_not_confirmed@test.com"
            });

        console.log(response.body);

        // Assert

        expect(findUniqueMock).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('La Cuenta no ha sido confirmada');

        expect(response.status).not.toBe(200);
        expect(response.status).not.toBe(404);

        expect(findUniqueMock).toHaveBeenCalledTimes(1);

    })
})

