import { prisma } from '@src/config/prisma';
import { afterAll, beforeAll } from 'bun:test';

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});
