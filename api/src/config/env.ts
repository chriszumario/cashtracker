import * as v from 'valibot';

const isValidUrl = (value: string) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const urlPipe = v.pipe(v.string(), v.check(isValidUrl, 'Invalid URL format'));

const envSchema = v.object({
    APPLICATION_NAME: v.string(),
    APPLICATION_VERSION: v.string(),
    NODE_ENV: v.union([
        v.literal('development'),
        v.literal('production'),
        v.literal('test'),
    ]),
    PORT: v.pipe(v.number(), v.minValue(1), v.maxValue(65535)),
    BASE_URL: urlPipe,
    DATABASE_URL: v.pipe(v.string(), v.nonEmpty('DATABASE_URL is required')),
    ALLOWED_ORIGINS: v.pipe(
        v.string(),
        v.nonEmpty('Allowed origins is required'),
        v.transform((value) => value.split(',').map((item) => item.trim())),
        v.array(urlPipe)
    ),
    SMTP_HOST: v.string(),
    SMTP_PORT: v.pipe(v.number(), v.minValue(1), v.maxValue(65535)),
    SMTP_USER: v.string(),
    SMTP_PASS: v.string(),
    JWT_SECRET: v.pipe(v.string(), v.nonEmpty('JWT SECRET is required')),
    JWT_ACCESS_EXPIRATION: v.string(),
});

type EnvConfig = v.InferOutput<typeof envSchema>;

const rawEnv = {
    APPLICATION_NAME: process.env.APPLICATION_NAME ?? '',
    APPLICATION_VERSION: process.env.APPLICATION_VERSION ?? 'v1.0.1',
    NODE_ENV: process.env.NODE_ENV ?? 'production',
    PORT: Number(process.env.PORT) || 4000,
    BASE_URL: process.env.BASE_URL ?? 'http://localhost',
    DATABASE_URL: process.env.DATABASE_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    SMTP_HOST: process.env.SMTP_HOST ?? 'smtp.mailtrap.io',
    SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
    SMTP_USER: process.env.SMTP_USER ?? '',
    SMTP_PASS: process.env.SMTP_PASS ?? '',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
};

const validateEnv = (): EnvConfig => {
    const result = v.safeParse(envSchema, rawEnv);
    if (result.success) {
        return result.output;
    } else {
        console.error('Invalid NODE_ENV configuration:');
        result.issues.forEach((issue) => {
            console.error(`${issue.path?.[0]?.key}: ${issue.message}`);
        });
        process.exit(1);
    }
};

export const env = validateEnv();
