import { transporter } from '../config/nodemailer';

type EmailType = {
    name: string;
    email: string;
    token: string;
};

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transporter.sendMail({
            from: 'CashTracker <admin@cashtracker.com>',
            to: user.email,
            subject: 'CashTracker - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en CashTracker, ya esta casi lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>e ingresa el código: <b>${user.token}</b></p>`,
        });
    };

    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transporter.sendMail({
            from: 'CashTracker <admin@cashtracker.com>',
            to: user.email,
            subject: 'CashTracker - Reestablece tu Password',
            html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>e ingresa el código: <b>${user.token}</b></p>`,
        });
    };
}
