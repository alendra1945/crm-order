// prisma/seed.ts
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Generate 100 fake products with deterministic SKUs
  const total = 15;
  const products = Array.from({ length: total }).map((_, i) => {
    const sku = `SKU-INV-${String(i + 1).padStart(4, '0')}`; // SKU-INV-0001, ...
    return {
      sku,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
      category: faker.commerce.department(),
      quantity: faker.number.int({ min: 0, max: 200 }),
      imageUrl: `https://picsum.photos/seed/${sku}/400/300`,
    };
  });

  // Idempotency: insert only missing SKUs
  const existing = await prisma.product.findMany({
    select: { sku: true },
  });
  const existingSet = new Set(existing.map((e) => e.sku));
  const toInsert = products.filter((p) => !existingSet.has(p.sku));

  if (toInsert.length > 0) {
    await prisma.product.createMany({
      data: toInsert,
    });
  }

  console.log(`🌱 Seeded products: inserted ${toInsert.length}, total intended ${total}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
