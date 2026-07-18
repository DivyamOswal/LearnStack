import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('ChangeMe123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@LearnStack.dev' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@LearnStack.dev',
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const categories = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'Express.js', 'PostgreSQL', 'Prisma', 'Git', 'Docker', 'AWS',
    'System Design', 'DSA',
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/[.\s]/g, '-'),
      },
    });
  }

  console.log('✅ Seed complete. Admin login:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });