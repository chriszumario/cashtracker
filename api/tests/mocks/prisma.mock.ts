import { mock } from 'bun:test';
import { PrismaClient } from '@prisma/client';
import { createPrismaMock, type PrismaClientMock } from 'bun-mock-prisma';
import { prisma } from '@src/config/prisma';

// Mock the module that exports your Prisma client
mock.module('@src/config/prisma', () => ({
    __esModule: true,
    prisma: createPrismaMock<PrismaClient>(),
}));

// Export the mocked client for use in tests
export const prismaMock = prisma as unknown as PrismaClientMock<PrismaClient>;
