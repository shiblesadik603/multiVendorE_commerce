import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

// The same six categories the frontend seller form offers.
export const CATEGORIES = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Decor", slug: "home-decor" },
  { name: "Gadgets", slug: "gadgets" },
  { name: "Accessories", slug: "accessories" },
  { name: "AI & Digital Assets", slug: "ai-digital-assets" },
];

export async function seedCategories(client: PrismaClient = prisma) {
  for (const c of CATEGORIES) {
    await client.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
  }
}

// Run directly: `npm run seed`. Safe to repeat (upsert).
if (process.argv[1]?.endsWith("seed.ts")) {
  seedCategories()
    .then(() => console.log(`Seeded ${CATEGORIES.length} categories`))
    .finally(() => prisma.$disconnect());
}
