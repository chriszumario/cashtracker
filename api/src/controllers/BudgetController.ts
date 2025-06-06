import type { Request, Response } from 'express';
import { prisma } from '@src/config/prisma';
import { handleError } from '@src/utils/handle-error';
export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await prisma.budget.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                where: {
                    userId: req.user!.id,
                },
            });
            res.json(budgets);
        } catch (error) {
            handleError(res, error);
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
            const { name, amount } = req.body;
            await prisma.budget.create({
                data: {
                    name,
                    amount,
                    userId: req.user!.id,
                },
            });
            res.status(201).json('Presupuesto Creado Correctamente');
        } catch (error) {
            handleError(res, error);
        }
    };

    static getById = async (req: Request, res: Response) => {
        const budget = await prisma.budget.findUnique({
            where: {
                id: req.budget!.id,
            },
            include: {
                expenses: true,
            },
        });
        res.json(budget);
    };

    static updateById = async (req: Request, res: Response) => {
        const { name, amount } = req.body;
        await prisma.budget.update({
            where: {
                id: req.budget!.id,
            },
            data: {
                name,
                amount,
            },
        });

        res.json('Presupuesto actualizado correctamente');
    };

    static deleteById = async (req: Request, res: Response) => {
        await prisma.budget.delete({
            where: {
                id: req.budget!.id,
            },
        });

        res.json('Presupuesto eliminado');
    };
}
