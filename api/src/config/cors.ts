import type { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS configuration options
 */
export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        if (env.NODE_ENV === 'development') {
            console.log(
                'CORS: Request without origin allowed in development mode'
            );
            return callback(null, true);
        }

        if (env.ALLOWED_ORIGINS.includes(origin || '')) {
            return callback(null, true);
        }

        console.log(`CORS error: Origin ${origin || 'unknown'} not allowed`);
        return callback(
            new Error(`CORS error: Origin ${origin || 'unknown'} not allowed`)
        );
    },
};
