import { encryptPassword } from '../utils/bcrypt';

export const users = [
    {
        name: 'Alex Martínez',
        email: 'alex@correo.com',
        password: await encryptPassword('123456'),
        confirmed: true,
        token: null,
    },
];

export const budgets = [
    {
        name: 'Presupuesto Marzo 2024',
        amount: 3000.1,
    },
];

export const expenses = [
    {
        name: 'Renta Apartamento',
        amount: 1200.0,
    },
    {
        name: 'Servicios Básicos',
        amount: 150.5,
    },
    {
        name: 'Supermercado',
        amount: 400.0,
    },
];
