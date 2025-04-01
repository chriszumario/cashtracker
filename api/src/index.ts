import server from './server';

import { env } from './config/env';
import { prisma } from './config/prisma';

const port = env.PORT;
const host = env.BASE_URL;

server.listen(port, async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
        console.log(`API URL: ${host}:${port}/api`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
});
