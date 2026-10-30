import { prisma } from "../../lib/prisma.js";

/** All categories, alphabetical. Small table, so no pagination. */
export function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, parentId: true },
  });
}
