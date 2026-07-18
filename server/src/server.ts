import app from '../app';
import { env } from './config/env';
import prisma from './config/db';

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Confirm DB connection before accepting traffic
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('🛑 Server shutting down (SIGINT).');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('🛑 Server shutting down (SIGTERM).');
  process.exit(0);
});