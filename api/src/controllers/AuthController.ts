import type { Request, Response } from 'express';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { prisma } from '../config/prisma';
import { encryptPassword, verifyPassword } from '../utils/bcrypt';
import { generateJWT } from '../utils/jwt';

declare global {
    var cashTrackrConfirmationToken: string | undefined;
}

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        // Prevenir duplicados
        const userExists = await prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            const error = new Error(
                'Un usuario con ese email ya esta registrado'
            );
            return res.status(409).json({ error: error.message });
        }

        try {
            const token = generateToken();

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: await encryptPassword(password),
                    token,
                },
            });

            if (process.env.NODE_ENV !== 'production') {
                globalThis.cashTrackrConfirmationToken = token;
            }

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token!,
            });

            res.status(201).json('Cuenta Creada Correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;

        const user = await prisma.user.findFirst({
            where: { token },
        });
        if (!user) {
            const error = new Error('Token no válido');
            return res.status(401).json({ error: error.message });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                confirmed: true,
                token: null,
            },
        });

        res.json('Cuenta confirmada correctamente');
    };

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Revisar que el usuario exista
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }

        if (!user.confirmed) {
            const error = new Error('La Cuenta no ha sido confirmada');
            return res.status(403).json({ error: error.message });
        }

        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Password Incorrecto');
            return res.status(401).json({ error: error.message });
        }

        const token = generateJWT({ id: user.id });
        res.json(token);
    };

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        // Revisar que el usuario exista
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }

        const token = generateToken();
        await prisma.user.update({
            where: { id: user.id },
            data: {
                token,
            },
        });
        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token,
        });
        res.json('Revisa tu email para instrucciones');
    };

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body;
        const tokenExists = await prisma.user.findFirst({
            where: { token },
        });
        if (!tokenExists) {
            const error = new Error('Token no válido');
            return res.status(404).json({ error: error.message });
        }

        res.json('Token válido, asigna un nuevo password');
    };

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;

        const user = await prisma.user.findFirst({
            where: { token },
        });
        if (!user) {
            const error = new Error('Token no válido');
            return res.status(404).json({ error: error.message });
        }

        // Asignar el nuevo password
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: await encryptPassword(password),
                token: null,
            },
        });

        res.json('El password se modificó correctamente');
    };

    static user = async (req: Request, res: Response) => {
        res.json(req.user);
    };

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body;
        const id = req.user!.id;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        const isPasswordCorrect = await verifyPassword(
            current_password,
            user!.password
        );
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            return res.status(401).json({ error: error.message });
        }

        await prisma.user.update({
            where: { id },
            data: {
                password: await encryptPassword(password),
            },
        });

        res.json('El password se modificó correctamente');
    };

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body;
        const id = req.user!.id;
        const user = await prisma.user.findUnique({
            where: { id },
        });

        const isPasswordCorrect = await verifyPassword(
            password,
            user!.password
        );
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            return res.status(401).json({ error: error.message });
        }
        res.json('Password Correcto');
    };

    static updateUser = async (req: Request, res: Response) => {
        const { name, email } = req.body;

        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser && existingUser.id !== req.user!.id) {
                const error = new Error(
                    'Ese email ya está registrado por otro usuario'
                );
                return res.status(409).json({ error: error.message });
            }

            await prisma.user.update({
                where: { id: req.user!.id },
                data: {
                    email,
                    name,
                },
            });
            res.json('Perfil actualizado correctamente');
        } catch (error) {
            console.error(error);
            res.status(500).json('Hubo un error');
        }
    };
}
