import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { createRequest, createResponse } from 'node-mocks-http';
import { prismaMock } from '@tests/mocks/prisma.mock';
import { validateExpenseExists } from '@src/middleware/expense';
import { expenses } from '@tests/fixtures/expense.fixture';
import { budgets } from '@src/data/seed-data';
import { hasAccess } from '@src/middleware/budget';

// Test constants
const USER_ID = 1;
const EXPENSE_ID = 1;
const NON_EXISTENT_USER_ID = 999;
const NON_EXISTENT_EXPENSE_ID = 999;
const NEW_EXPENSE = {
    name: 'New Expense',
    amount: 500,
};

// Helper functions for mocking
const mockFindUniqueExpense = () => {
    prismaMock.expense.findUnique.mockImplementation((option) => {
        const expense =
            expenses.filter((e) => e.id === option.where.id)[0] ?? null;
        return Promise.resolve(expense);
    });
};

describe('Expenses Middleware - validateExpenseExists', () => {
    beforeEach(() => {
        prismaMock._reset(); // Reset mocks before each test
        mockFindUniqueExpense(); // Mock the findUnique method
    });
    test('should handle non-existent expense', async () => {
        // Arrange
        const req = createRequest({
            params: { expenseId: NON_EXISTENT_EXPENSE_ID }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();

        // Act
        await validateExpenseExists(req, res, next);

        // Assert
        const data = res._getJSONData();
        expect(prismaMock.expense.findUnique).toHaveBeenCalledWith({
            where: { id: NON_EXISTENT_EXPENSE_ID },
        });
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Gasto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next middleware if expense exists', async () => {
        // Arrange
        const req = createRequest({
            params: { expenseId: EXPENSE_ID }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();

        // Act
        await validateExpenseExists(req, res, next);

        // Assert
        expect(prismaMock.expense.findUnique).toHaveBeenCalledWith({
            where: { id: EXPENSE_ID },
        });

        expect(req.expense).toEqual(expenses[0]);
        expect(next).toHaveBeenCalled();
    });

    test('should handle internal server error', async () => {
        // Arrange
        const req = createRequest({
            params: { expenseId: EXPENSE_ID }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();

        // Mock the findUnique method to throw an error
        prismaMock.expense.findUnique.mockRejectedValue(new Error());

        // Act
        await validateExpenseExists(req, res, next);

        // Assert
        expect(prismaMock.expense.findUnique).toHaveBeenCalledWith({
            where: { id: EXPENSE_ID },
        });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Hubo un error' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should prevent unauthorized users from adding expenses', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets[0],
            user: { id: NON_EXISTENT_USER_ID },
            body: NEW_EXPENSE,
        });
        const res = createResponse();
        const next = mock();

        // Act
        hasAccess(req, res, next);

        // Assert
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ error: 'Acción no válida' });
        expect(next).not.toHaveBeenCalled();
    });
});
