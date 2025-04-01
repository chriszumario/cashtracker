import { prisma } from '../config/prisma';

async function resetDatabase(): Promise<void> {
    try {
        await prisma.expense.deleteMany({});
        await prisma.budget.deleteMany({});
        await prisma.user.deleteMany({});

        console.log('Database cleaned successfully!');
    } catch (error) {
        console.error('Error cleaning database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (process.argv[2] === '--reset') {
    resetDatabase();
}
