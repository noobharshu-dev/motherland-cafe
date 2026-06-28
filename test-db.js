const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.menuItem.findMany({
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(items, null, 2));
}

main().finally(() => prisma.$disconnect());
