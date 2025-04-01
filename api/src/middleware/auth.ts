import type { User } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt';
import { prisma } from '../config/prisma';

declare global {
    namespace Express {
        interface Request {
            user?: Pick<User, 'id' | 'name' | 'email'>;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message });
    }

    const [, token] = bearer.split(' ');
    if (!token) {
        const error = new Error('Token no válido');
        return res.status(401).json({ error: error.message });
    }

    try {
        const decoded = verifyJWT(token);
        if (typeof decoded === 'object' && decoded.id) {
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            req.user = user!;
            next();
        }
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(500).json({ error: 'Token no válido' });
    }
};
