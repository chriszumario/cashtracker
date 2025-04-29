import type { Response } from 'express';
import { env } from '@src/config/env';

export const handleError = (
    res: Response,
    error: unknown,
    message = 'Hubo un error'
) => {
    if (env.ENVIRONMENT === 'development') {
        console.error(error);
    }
    return res.status(500).json({ error: message });
};
