import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.JWT_SECRET;

export const generateJWT = (payload: JwtPayload) => {
    return sign(payload, JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const verifyJWT = (token: string) => {
    try {
        return verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Token verification error:', error);
        throw new Error('Token no válido');
    }
};
