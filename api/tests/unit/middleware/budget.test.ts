import { validateBudgetExists } from '@src/middleware/budget';
import { describe, test, expect, mock } from 'bun:test';
import { createRequest, createResponse } from 'node-mocks-http';
import { prismaMock } from '../../mocks/prisma.mock';

describe('Budget Middleware - validateBudgetExists', () => {
    test('should handle non-existent budget', async () => {
        // Arrange
        const budgetId = 3;
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            params: { budgetId: String(budgetId) }, // Correctly set params
        });
        const res = createResponse();
        const next = mock();
        prismaMock.budget.findUnique.mockResolvedValue(null); // Simulate non-existent budget
        // Act
        await validateBudgetExists(req, res, next);
        // Assert
        const data = res._getJSONData();
        expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
            where: { id: budgetId },
        });
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Presupuesto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });
});
