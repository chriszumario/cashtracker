import { beforeEach, describe, expect, test } from 'bun:test';
import { createRequest, createResponse } from 'node-mocks-http';
import { prismaMock } from '@tests/mocks/prisma.mock';
import { ExpensesController } from '@src/controllers/ExpenseController';
import { expenses } from '@tests/fixtures/expense.fixture';

// Test constants
const BUDGET_ID = 1;
const NEW_EXPENSE = {
    name: 'New Expense',
    amount: 500,
};

describe('ExpensesController.create', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
    });

    test('should create a new expense', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: NEW_EXPENSE,
            budget: { id: BUDGET_ID },
        });
        const res = createResponse();

        // Mock the create method
        prismaMock.expense.create.mockResolvedValue({
            ...NEW_EXPENSE,
            id: 1,
            budgetId: BUDGET_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Act
        await ExpensesController.create(req, res);

        // Assert
        expect(prismaMock.expense.create).toHaveBeenCalledWith({
            data: {
                ...NEW_EXPENSE,
                budgetId: BUDGET_ID,
            },
        });
        expect(prismaMock.expense.create).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual('Gasto Agregado Correctamente');
    });
    test('should handle expense creation error', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: NEW_EXPENSE,
            budget: { id: BUDGET_ID },
        });
        const res = createResponse();

        // Mock the create method to throw an error
        prismaMock.expense.create.mockRejectedValue(new Error());

        // Act
        await ExpensesController.create(req, res);

        // Assert
        expect(prismaMock.expense.create).toHaveBeenCalledWith({
            data: {
                ...NEW_EXPENSE,
                budgetId: BUDGET_ID,
            },
        });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Hubo un error' });
    });
});

describe('ExpensesController.getById', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
    });

    test('should get an expense by ID', async () => {
        // Arrange
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0],
        });
        const res = createResponse();

        // Act
        await ExpensesController.getById(req, res);

        // Assert
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(req.expense);
    });
});

describe('ExpensesController.updateById', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
    });

    test('should update an expense by ID', async () => {
        // Arrange
        const req = createRequest({
            method: 'PATCH',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            body: NEW_EXPENSE,
            expense: expenses[0],
        });
        const res = createResponse();

        // Mock the update method
        prismaMock.expense.update.mockResolvedValue({
            ...NEW_EXPENSE,
            id: 1,
            budgetId: BUDGET_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Act
        await ExpensesController.updateById(req, res);

        // Assert
        expect(prismaMock.expense.update).toHaveBeenCalledWith({
            where: {
                id: req.expense!.id,
            },
            data: {
                ...NEW_EXPENSE,
            },
        });
        expect(prismaMock.expense.update).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual('Se actualizó correctamente');
    });
});

describe('ExpensesController.deleteById', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
    });

    test('should delete an expense by ID', async () => {
        // Arrange
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            budget: { id: BUDGET_ID },
            expense: expenses[0],
        });
        const res = createResponse();

        // Mock the delete method
        prismaMock.expense.delete.mockResolvedValue({
            ...expenses[0],
            createdAt: new Date(expenses[0].createdAt),
            updatedAt: new Date(expenses[0].updatedAt),
        });

        // Act
        await ExpensesController.deleteById(req, res);

        // Assert
        expect(prismaMock.expense.delete).toHaveBeenCalledWith({
            where: {
                id: req.expense!.id,
            },
        });
        expect(prismaMock.expense.delete).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual('Gasto Eliminado');
    });
});
