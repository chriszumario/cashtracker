import { beforeAll, describe, expect, spyOn, test } from 'bun:test'
import request from 'supertest'
import app from '@src/server';
import { AuthController } from '@src/controllers/AuthController';
import * as bcryptPassword from '@src/utils/bcrypt';
import * as token from '@src/utils/jwt';
import { prisma } from '@src/config/prisma';

describe('Authentication - Create Account', () => {
    test('should display validation errors when form is empty', async () => {
        // Arrange
        const createAccountMock = spyOn(AuthController, "createAccount");

        // Act
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({})

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
        const createAccountMock = spyOn(AuthController, "createAccount");

        // Act
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                name: 'John Doe',
                email: 'invalid-email',
                password: 'password',
            })

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
        const createAccountMock = spyOn(AuthController, "createAccount");

        // Act
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                'name': 'John Doe',
                'email': 'test@mail.com',
                'password': 'pass'
            })

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

        // Act
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

        // Act
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

        // Act
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

        // Act
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

        // Act
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
        const loginMock = spyOn(AuthController, 'login')

        // Act
        const response = await request(app)
            .post('/api/auth/login')
            .send({})

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(200)
        expect(loginMock).not.toHaveBeenCalled()
    })

    test('should return 400 bad request when the email is invalid', async () => {
        // Arrange
        const loginMock = spyOn(AuthController, 'login')

        // Act
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'invalid-email',
                password: 'password'
            })

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

        // Act
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
            token: '123456',
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

        // Assert
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('La Cuenta no ha sido confirmada');

        expect(response.status).not.toBe(200);
        expect(response.status).not.toBe(404);

        expect(findUniqueMock).toHaveBeenCalledTimes(1);

    })

    test('should return a 403 error if the user account is not confirmed', async () => {
        // Arrange
        const userData = {
            id: 1,
            name: 'Test User',
            email: 'user_not_confirmed@test.com',
            password: 'hashedpassword',
        };

        // Act
        await request(app)
            .post('/api/auth/create-account')
            .send({
                name: userData.name,
                email: userData.email,
                password: userData.password
            })

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password: userData.password,
                email: userData.email
            })

        // Assert
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La Cuenta no ha sido confirmada')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
    })

    test('should return a 401 error if the password is incorrect', async () => {
        // Arrange
        const findUniqueMock = spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
            id: 1,
            name: 'Test User',
            email: 'test@mail.com',
            password: 'hashedpassword',
            token: null,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const verifyPasswordMock = spyOn(bcryptPassword, 'verifyPassword').mockResolvedValue(false);

        // Act
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                'email': 'test@example.com',
                'password': 'incorrectpassword'
            })

        // Assert
        expect(verifyPasswordMock).toHaveBeenCalledTimes(1)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Password Incorrecto')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(403)

        expect(findUniqueMock).toHaveBeenCalledTimes(1)
        expect(verifyPasswordMock).toHaveBeenCalledTimes(1)
    })

    test('should return a jwt ', async () => {
        // // Arrange
        const findUniqueMock = spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword',
            token: null,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const verifyPasswordMock = spyOn(bcryptPassword, 'verifyPassword').mockResolvedValue(true);
        const generateJWTMock = spyOn(token, 'generateJWT').mockReturnValue('jwt_token');

        // Act
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                'email': 'test@mail.com',
                'password': 'correctpassword'
            })

        // Assert
        expect(response.status).toBe(200)
        expect(response.body.jwt).toEqual('jwt_token')

        expect(findUniqueMock).toHaveBeenCalled()
        expect(findUniqueMock).toHaveBeenCalledTimes(1)

        expect(verifyPasswordMock).toHaveBeenCalled()
        expect(verifyPasswordMock).toHaveBeenCalledTimes(1)
        expect(verifyPasswordMock).toHaveBeenCalledWith('correctPassword', 'hashedPassword')

        expect(generateJWTMock).toHaveBeenCalled()
        expect(generateJWTMock).toHaveBeenCalledTimes(1)
        expect(generateJWTMock).toHaveBeenCalledWith(500)
    })
})


let jwt: string

async function authenticateUser() {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: "test@mail.com",
            password: "password"
        })
    jwt = response.body.token
    expect(response.status).toBe(200)
}

describe('GET /api/budgets', () => {
    beforeAll(async () => {
        await authenticateUser()
    })

    test('should reject unauthenticated access to budgets without a jwt', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets')

        // Assert
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('No Autorizado')
    })

    test('should reject unauthenticated access to budgets without a valid jwt', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets')
            .auth('not_valid', { type: 'bearer' })

        // Assert
        expect(response.status).toBe(500)
        expect(response.body.error).toBe('Token no válido')
    })

    test('should allow authenticated access to budgets with a valid jwt', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets')
            .auth(jwt, { type: 'bearer' })

        // Assert
        expect(response.body).toHaveLength(0)
        expect(response.status).not.toBe(401)
        expect(response.body.error).not.toBe('No Autorizado')
    })
})

describe('POST /api/budgets', () => {

    beforeAll(async () => {
        await authenticateUser()
    })

    test('should reject unauthenticated post request to budgets without a jwt', async () => {
        // Act
        const response = await request(app)
            .post('/api/budgets')

        // Assert
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    test('should display validation when the form is submitted with invalid data ', async () => {
        // Act
        const response = await request(app)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({})

        // Assert
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(4)
    })

    test('should create a new budget and return a success message ', async () => {
        // Act
        const response = await request(app)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({
                "name": "Test Budget",
                "amount": 4000
            })

        // Assert
        expect(response.status).toBe(201)
        expect(response.body).toBe("Presupuesto Creado Correctamente")
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(401)
    })
})

describe('GET /api/budgets/:id', () => {
    beforeAll(async () => {
        await authenticateUser()
    })

    test('should reject unauthenticated get request to budget id without a jwt', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets/1')

        // Assert
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    test('should return 400 bad request when id is not valid', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets/not_valid')
            .auth(jwt, { type: 'bearer' })

        // Assert
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
        expect(response.status).not.toBe(401)
        expect(response.body.error).not.toBe('No Autorizado')
    })

    test('should return 404 not found when a budget doesnt exists', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets/3000')
            .auth(jwt, { type: 'bearer' })

        // Assert
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Presupuesto no encontrado')
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(401)
    })

    test('should return a single budget by id', async () => {
        // Act
        const response = await request(app)
            .get('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })

        // Assert
        expect(response.status).toBe(200)
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(401)
        expect(response.status).not.toBe(404)
    })

})

describe('PUT /api/budgets/:id', () => {
    beforeAll(async () => {
        await authenticateUser()
    })

    test('should reject unauthenticated put request to budget id without a jwt', async () => {
        // Act
        const response = await request(app)
            .put('/api/budgets/1')

        // Assert
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    test('should display validation errors if the form is empty', async () => {
        // Act
        const response = await request(app)
            .put('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
            .send({})

        // Assert
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(4)
    })

    test('should update a budget by id and return a success message', async () => {
        // Act
        const response = await request(app)
            .put('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
            .send({
                name: "Updated Budget",
                amount: 300
            })

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toBe('Presupuesto actualizado correctamente')
    })

})

describe('DELETE /api/budgets/:id', () => {
    beforeAll(async () => {
        await authenticateUser()
    })

    test('should reject unauthenticated put request to budget id without a jwt', async () => {
        // Act
        const response = await request(app)
            .delete('/api/budgets/1')

        // Assert
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    test('should return 404 not found when a budget doesnt exists', async () => {
        // Act
        const response = await request(app)
            .delete('/api/budgets/3000')
            .auth(jwt, { type: 'bearer' })

        // Assert
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Presupuesto no encontrado')
    })

    test('should delete a budget and return a success message', async () => {
        // Act
        const response = await request(app)
            .delete('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toBe('Presupuesto eliminado')
    })

})
