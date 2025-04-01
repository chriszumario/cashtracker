import nodemailer from 'nodemailer';
import { env } from './env';

const configMailer = () => {
    return {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    };
};

export const transporter = nodemailer.createTransport(configMailer());
