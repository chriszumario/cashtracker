import { describe, test, expect, beforeEach } from 'bun:test';
import { createRequest, createResponse } from 'node-mocks-http';
import { BudgetController } from '@src/controllers/BudgetController';
import { prismaMock } from '../../mocks/prisma.mock';
import { budgets } from '../../fixtures/budget.fixture';

const mockFindManyBudgets = () => {
    prismaMock.budget.findMany.mockImplementation((options) => {
        const userBudgets = budgets
            .filter((budget) => budget.userId === options?.where?.userId)
            .map((budget) => ({
                ...budget,
                createdAt: new Date(budget.createdAt),
                updatedAt: new Date(budget.updatedAt),
            }));
        return Promise.resolve(userBudgets);
    });
};

const mockFindUniqueBudget = () => {
    prismaMock.budget.findUnique.mockImplementation((options) => {
        const budget = budgets.find((budget) => budget.id === options.where.id);
        if (budget) {
            return Promise.resolve(budget);
        }
        return Promise.resolve(null);
    });
};

describe('BudgetController.getAll', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
        mockFindManyBudgets(); // Mock the findMany method
    });

    test('should return budgets for the current user', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: userId },
        });
        const res = createResponse();

        // Act
        await BudgetController.getAll(req, res);

        // Assert
        const data = res._getJSONData();
        expect(prismaMock.budget.findMany).toHaveBeenCalledWith({
            orderBy: { createdAt: 'desc' },
            where: { userId },
        });
        expect(prismaMock.budget.findMany).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(data).toHaveLength(2);
    });

    test('should return an empty array if the user has no budgets', async () => {
        // Arrange
        const userId = 99; // User with no budgets

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: userId },
        });
        const res = createResponse();

        // Act
        await BudgetController.getAll(req, res);

        // Assert
        const data = res._getJSONData();
        expect(prismaMock.budget.findMany).toHaveBeenCalledWith({
            orderBy: { createdAt: 'desc' },
            where: { userId },
        });
        expect(prismaMock.budget.findMany).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(data).toEqual([]);
    });

    test('should handle database errors gracefully', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: userId },
        });
        const res = createResponse();
        prismaMock.budget.findMany.mockRejectedValue(new Error());

        // Act
        await BudgetController.getAll(req, res);

        // Assert
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Hubo un error' });
    });
});

describe('BudgetController.create', () => {
    test('Should create a new budget and respond with statusCode 201', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: { id: userId },
            body: {
                name: 'New Budget',
                amount: 500,
            },
        });
        const res = createResponse();

        prismaMock.budget.create.mockResolvedValue({
            id: 3,
            name: 'New Budget',
            amount: 500,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Act
        await BudgetController.create(req, res);

        // Assert
        expect(prismaMock.budget.create).toHaveBeenCalledWith({
            data: {
                ...req.body,
                userId,
            },
        });
        expect(prismaMock.budget.create).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toBe('Presupuesto Creado Correctamente');
    });
    test('Should handle errors gracefully', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: { id: userId },
            body: {
                name: 'New Budget',
                amount: 500,
            },
        });
        const res = createResponse();

        prismaMock.budget.create.mockRejectedValue(new Error());

        // Act
        await BudgetController.create(req, res);

        // Assert
        expect(prismaMock.budget.create).toHaveBeenCalledWith({
            data: {
                ...req.body,
                userId,
            },
        });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Hubo un error' });
    });
});

describe('BudgetController.getById', () => {
    beforeEach(() => {
        mockFindUniqueBudget();
    });
    test('should return a budget with ID 1 and 3 expenses', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: { id: userId },
        });
        const res = createResponse();

        // Act
        await BudgetController.getById(req, res);

        // Assert
        const data = res._getJSONData();
        expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
            where: { id: userId },
            include: { expenses: true },
        });
        expect(prismaMock.budget.findUnique).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(budgets[0]);
        expect(data.expenses.length).toBe(3);
    });
    test('should return a budget with ID 3 and 0 expenses', async () => {
        // Arrange
        const userId = 3;
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: { id: userId },
        });
        const res = createResponse();

        // Act
        await BudgetController.getById(req, res);

        // Assert
        const data = res._getJSONData();
        expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
            where: { id: userId },
            include: { expenses: true },
        });
        expect(prismaMock.budget.findUnique).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(data.expenses.length).toBe(0);
    });
});

describe('BudgetController.updateById', () => {
    test('should update a budget with ID 1', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'PATCH',
            url: '/api/budgets/:budgetId',
            budget: { id: userId },
            body: {
                name: 'Updated Budget',
                amount: 1000,
            },
        });
        const res = createResponse();

        // Act
        await BudgetController.updateById(req, res);

        // Assert
        expect(prismaMock.budget.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: req.body,
        });
        expect(prismaMock.budget.update).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toBe(
            'Presupuesto actualizado correctamente'
        );
    });
});

describe('BudgetController.deleteById', () => {
    test('should delete a budget with ID 1', async () => {
        // Arrange
        const userId = 1;
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: { id: userId },
        });
        const res = createResponse();

        // Act
        await BudgetController.deleteById(req, res);

        // Assert
        expect(prismaMock.budget.delete).toHaveBeenCalledWith({
            where: { id: userId },
        });
        expect(prismaMock.budget.delete).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toBe('Presupuesto eliminado');
    });
});
