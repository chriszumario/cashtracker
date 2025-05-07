import { describe, test, expect, beforeEach, mock, spyOn } from 'bun:test';
import { createRequest, createResponse } from 'node-mocks-http';
import { prismaMock } from '@tests/mocks/prisma.mock';
import { AuthController } from '@src/controllers/AuthController';
import { AuthEmail } from '@src/emails/AuthEmail';



// Test constants
const USER_ID = 1;
const NEW_USER = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
};

// Mock bcrypt module
mock.module('@src/utils/bcrypt', () => ({
    verifyPassword: mock(),
}));
const { verifyPassword } = await import('@src/utils/bcrypt');

// Mock JWT module
mock.module('@src/utils/jwt', () => ({
    generateJWT: mock()
}));
const { generateJWT } = await import('@src/utils/jwt');

describe('AuthController.createAccount', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
    });

    test('should return a 409 status and an error message if the email is already registered', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: NEW_USER,
        });
        const res = createResponse();

        // Mock the database response to simulate an existing user
        prismaMock.user.findUnique.mockResolvedValue({
            id: USER_ID,
            name: NEW_USER.name,
            email: NEW_USER.email,
            password: NEW_USER.password,
            token: null,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Act
        await AuthController.createAccount(req, res);

        // Assert
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: NEW_USER.email },
        });
        expect(res.statusCode).toBe(409);
        expect(res._getJSONData()).toEqual({
            error: 'Un usuario con ese email ya esta registrado',
        });
    });

    test('should register a new user and return a success message', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: NEW_USER,
        });
        const res = createResponse();

        // Mock the database response to simulate no existing user
        prismaMock.user.findUnique.mockResolvedValue(null);

        // Mock the database response for user creation
        prismaMock.user.create.mockResolvedValue({
            id: USER_ID,
            name: NEW_USER.name,
            email: NEW_USER.email,
            password: 'hashedPassword123',
            token: 'generatedToken',
            confirmed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock the email sending function
        const sendConfirmationEmailSpy = spyOn(
            AuthEmail,
            'sendConfirmationEmail'
        ).mockResolvedValue();

        // Act
        await AuthController.createAccount(req, res);

        // Assert
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: NEW_USER.email },
        });
        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: {
                name: NEW_USER.name,
                email: NEW_USER.email,
                password: expect.any(String), // Ensure password is hashed
                token: expect.any(String), // Ensure token is generated
            },
        });
        expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
        expect(sendConfirmationEmailSpy).toHaveBeenCalledWith({
            name: NEW_USER.name,
            email: NEW_USER.email,
            token: 'generatedToken',
        });
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toBe('Cuenta Creada Correctamente');
    });
});

describe('AuthController.login', () => {
    test('should return 404 if user is not found', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: NEW_USER.email,
                password: NEW_USER.password,
            },
        });
        const res = createResponse();

        // Mock the database response to simulate no user found
        prismaMock.user.findUnique.mockResolvedValue(null);

        // Act
        await AuthController.login(req, res);

        // Assert
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: req.body.email },
        });
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            error: 'Usuario no encontrado',
        });
    });

    test('should return 403 if the account has not been confirmed', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: NEW_USER.email,
                password: NEW_USER.password,
            },
        });
        const res = createResponse();
        // Mock the database response to simulate an unconfirmed user
        prismaMock.user.findUnique.mockResolvedValue({
            id: USER_ID,
            name: NEW_USER.name,
            email: NEW_USER.email,
            password: 'hashedPassword123',
            token: null,
            confirmed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Act
        await AuthController.login(req, res);
        // Assert
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: req.body.email },
        });
        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({
            error: 'La Cuenta no ha sido confirmada',
        });
    });

    test('should return 401 if the password is incorrect', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: NEW_USER.email,
                password: 'wrongPassword',
            },
        });
        const res = createResponse();

        // Mock the database response to simulate a user with a different password
        prismaMock.user.findUnique.mockResolvedValue({
            id: USER_ID,
            name: NEW_USER.name,
            email: NEW_USER.email,
            password: 'hashedPassword123',
            token: null,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Mock the password comparison function to simulate a failed comparison
        verifyPassword.mockResolvedValue(false);

        // Act
        await AuthController.login(req, res);

        // Assert
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: req.body.email },
        });
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            error: 'Password Incorrecto',
        });
    });

    test('should return a JWT if authentication is successful', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: NEW_USER.email,
                password: NEW_USER.password,
            },
        });
        const res = createResponse();

        // Mock the database response to simulate a successful login
        prismaMock.user.findUnique.mockResolvedValue({
            id: USER_ID,
            name: NEW_USER.name,
            email: NEW_USER.email,
            password: 'hashedPassword123', // This should be the hashed password
            token: null,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock password verification to return true
        verifyPassword.mockResolvedValue(true);

        // Mock the JWT generation function to return a specific token
        generateJWT.mockReturnValue('generatedJWT');

        // Act
        await AuthController.login(req, res);

        // Assert
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: req.body.email },
        });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            token: 'generatedJWT',
        });
    });
});
