import { prisma } from '../src/config/prisma';
import { users, budgets, expenses } from '../src/data/seed-data';

async function seed() {
    // Clean database
    await prisma.$transaction([
        prisma.expense.deleteMany(),
        prisma.budget.deleteMany(),
        prisma.user.deleteMany(),
    ]);

    // Create test user
    const user = await prisma.user.create({
        data: users[0],
    });

    // Create test budget
    const budget = await prisma.budget.create({
        data: {
            ...budgets[0],
            userId: user.id,
        },
    });

    // Create test expenses
    await prisma.expense.createMany({
        data: expenses.map((expense) => ({
            ...expense,
            amount: expense.amount,
            budgetId: budget.id,
        })),
    });
}

// Run seed
async function main() {
    try {
        console.log('🌱 Starting seed...');
        await seed();
        console.log('✅ Seed completed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
