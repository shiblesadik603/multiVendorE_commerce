import { AppError } from "@marketplace/common";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/index.js";
import { pageMeta, toOwnProduct, toPublicProduct } from "./products.dto.js";
import type { CreateProductInput, OwnListQuery, PublicListQuery, UpdateProductInput } from "./products.schemas.js";

const include = { images: true, category: true, seller: true } satisfies Prisma.ProductInclude;

/** Buyers only see ACTIVE + approved products from approved sellers. */
const publicWhere: Prisma.ProductWhereInput = {
  status: "ACTIVE",
  moderation: "APPROVED",
  seller: { status: "APPROVED" },
};

const orderBy = (sort: PublicListQuery["sort"]): Prisma.ProductOrderByWithRelationInput[] =>
  sort === "price_asc"
    ? [{ price: "asc" }, { id: "asc" }]
    : sort === "price_desc"
      ? [{ price: "desc" }, { id: "asc" }]
      : [{ createdAt: "desc" }, { id: "asc" }]; // id as tie-breaker keeps pages stable

/** Public catalog: search + category + price filters, sorting, pagination. */
export async function listPublicProducts(q: PublicListQuery) {
  const where: Prisma.ProductWhereInput = {
    ...publicWhere,
    ...(q.category && { category: { slug: q.category } }),
    ...((q.minPrice !== undefined || q.maxPrice !== undefined) && { price: { gte: q.minPrice, lte: q.maxPrice } }),
    ...(q.search && {
      OR: [
        { title: { contains: q.search, mode: "insensitive" } },
        { description: { contains: q.search, mode: "insensitive" } },
      ],
    }),
  };
  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, include, orderBy: orderBy(q.sort), skip: (q.page - 1) * q.limit, take: q.limit }),
  ]);
  return { data: rows.map(toPublicProduct), meta: pageMeta(q.page, q.limit, total) };
}

/** One public product; hidden/archived/unapproved products look like they do not exist. */
export async function getPublicProduct(id: string) {
  const p = await prisma.product.findFirst({ where: { id, ...publicWhere }, include });
  if (!p) throw new AppError(404, "NOT_FOUND", "Product not found");
  return toPublicProduct(p);
}

/**
 * Seller profile is created on the seller's first catalog request.
 * (Day 9 replaces this with an apply + admin approval flow.)
 */
export async function ensureSellerProfile(userId: string) {
  const profile = await prisma.sellerProfile.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, shopName: `Seller-${userId.slice(0, 8)}` },
  });
  if (profile.status !== "APPROVED") throw new AppError(403, "SELLER_NOT_APPROVED", "Your seller account is not approved");
  return profile;
}

async function resolveCategoryId(input: { categoryId?: string; category?: string }) {
  const cat = await prisma.category.findFirst({
    where: input.categoryId ? { id: input.categoryId } : { slug: input.category },
    select: { id: true },
  });
  if (!cat) throw new AppError(422, "VALIDATION_ERROR", "Category does not exist", [{ field: "category", message: "Unknown category" }]);
  return cat.id;
}

/** The seller's own products (any status), newest first. */
export async function listOwnProducts(sellerId: string, q: OwnListQuery) {
  const where: Prisma.ProductWhereInput = { sellerId, ...(q.status && { status: q.status }) };
  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, include, orderBy: [{ createdAt: "desc" }, { id: "asc" }], skip: (q.page - 1) * q.limit, take: q.limit }),
  ]);
  return { data: rows.map(toOwnProduct), meta: pageMeta(q.page, q.limit, total) };
}

/**
 * Ownership check: the sellerId is part of the query, so another seller's product is
 * indistinguishable from a missing one (404, not 403: do not reveal it exists).
 */
export async function getOwnProduct(sellerId: string, id: string) {
  const p = await prisma.product.findFirst({ where: { id, sellerId }, include });
  if (!p) throw new AppError(404, "NOT_FOUND", "Product not found");
  return p;
}

export async function createProduct(sellerId: string, input: CreateProductInput) {
  await ensureSellerProfile(sellerId);
  const categoryId = await resolveCategoryId(input);
  const p = await prisma.product.create({
    data: {
      sellerId,
      categoryId,
      title: input.title,
      description: input.description,
      price: input.price,
      images: { create: input.imageUrls.map((url, position) => ({ url, position })) },
    },
    include,
  });
  return toOwnProduct(p);
}

export async function updateProduct(sellerId: string, id: string, input: UpdateProductInput) {
  await ensureSellerProfile(sellerId);
  await getOwnProduct(sellerId, id);
  const categoryId = input.categoryId || input.category ? await resolveCategoryId(input) : undefined;
  const p = await prisma.$transaction(async (tx) => {
    if (input.imageUrls) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({ data: input.imageUrls.map((url, position) => ({ productId: id, url, position })) });
    }
    // Edits send a changed product back to moderation in Day 9; for now just update fields.
    return tx.product.update({
      where: { id },
      data: { title: input.title, description: input.description, price: input.price, categoryId },
      include,
    });
  });
  return toOwnProduct(p);
}

/** Archive hides the product from buyers; activate puts it back. Nothing is deleted. */
export async function setProductStatus(sellerId: string, id: string, status: "ACTIVE" | "ARCHIVED") {
  await ensureSellerProfile(sellerId);
  await getOwnProduct(sellerId, id);
  return toOwnProduct(await prisma.product.update({ where: { id }, data: { status }, include }));
}
