import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { handleError } from '@src/utils/handle-error';

export class ExpensesController {
    static create = async (req: Request, res: Response) => {
        try {
            const { name, amount } = req.body;
            await prisma.expense.create({
                data: {
                    name,
                    amount,
                    budgetId: req.budget!.id,
                },
            });
            res.status(201).json('Gasto Agregado Correctamente');
        } catch (error) {
            handleError(res, error);
        }
    };

    static getById = async (req: Request, res: Response) => {
        res.json(req.expense);
    };

    static updateById = async (req: Request, res: Response) => {
        const { name, amount } = req.body;
        await prisma.expense.update({
            where: {
                id: req.expense!.id,
            },
            data: {
                name,
                amount,
            },
        });
        res.json('Se actualizó correctamente');
    };

    static deleteById = async (req: Request, res: Response) => {
        await prisma.expense.delete({
            where: {
                id: req.expense!.id,
            },
        });
        res.json('Gasto Eliminado');
    };
}
