import { hasAccess, validateBudgetExists } from '@src/middleware/budget';
import { describe, test, expect, mock } from 'bun:test';
import { createRequest, createResponse } from 'node-mocks-http';
import { prismaMock } from '@tests/mocks/prisma.mock';
import { budgets } from '@tests/fixtures/budget.fixture';

// Test constants
const USER_ID = 1;
const BUDGET_ID = 1;
const NON_EXISTENT_USER_ID = 999;
const NON_EXISTENT_BUDGET_ID = 3;
const BUDGET = {
    ...budgets[0],
    createdAt: new Date(budgets[0].createdAt),
    updatedAt: new Date(budgets[0].updatedAt),
};

describe('Budget Middleware - validateBudgetExists', () => {
    test('should handle non-existent budget', async () => {
        // Arrange
        const req = createRequest({
            params: { budgetId: NON_EXISTENT_BUDGET_ID }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();
        prismaMock.budget.findUnique.mockResolvedValue(null); // Simulate non-existent budget
        // Act
        await validateBudgetExists(req, res, next);
        // Assert
        const data = res._getJSONData();
        expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
            where: { id: NON_EXISTENT_BUDGET_ID },
        });
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Presupuesto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should proceed to next middleware if budget exists', async () => {
        // Arrange
        const req = createRequest({
            params: { budgetId: BUDGET_ID }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();
        prismaMock.budget.findUnique.mockResolvedValue(BUDGET); // Simulate existing budget
        // Act
        await validateBudgetExists(req, res, next);
        // Assert
        expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
            where: { id: BUDGET_ID },
        });
        expect(res.statusCode).toBe(200);
        expect(req.budget).toEqual(BUDGET);
        expect(next).toHaveBeenCalled();
    });
    test('should handle internal server error', async () => {
        // Arrange
        const req = createRequest({
            params: { budgetId: BUDGET_ID }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();
        prismaMock.budget.findUnique.mockRejectedValue(
            new Error('Database error')
        );
        // Act
        await validateBudgetExists(req, res, next);
        // Assert
        expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
            where: { id: BUDGET_ID },
        });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Hubo un error' });
        expect(next).not.toHaveBeenCalled();
    });
});

describe('Budget Middleware - hasAccess', () => {
    test('should call next() if user has access to budget', async () => {
        // Arrange
        const req = createRequest({
            budget: budgets[0],
            user: { id: USER_ID },
        });
        const res = createResponse();
        const next = mock();
        // Act
        await hasAccess(req, res, next);
        // Assert
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('should return 401 error if userId does not have access to budget', () => {
        // Arrange
        const req = createRequest({
            budget: budgets[0],
            user: { id: NON_EXISTENT_USER_ID },
        });
        const res = createResponse();
        const next = mock();
        // Act
        hasAccess(req, res, next);
        // Assert
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            error: 'Acción no válida',
        });
        expect(next).not.toHaveBeenCalled();
    });
});
