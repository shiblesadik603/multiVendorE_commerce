import type { Category, Product, ProductImage, SellerProfile } from "../../generated/prisma/index.js";

type Full = Product & { images: ProductImage[]; category: Category; seller: SellerProfile };

const sortedImages = (p: Full) => [...p.images].sort((a, b) => a.position - b.position);

/** Shape returned to anyone (buyers). No moderation/internal fields. */
export function toPublicProduct(p: Full) {
  const images = sortedImages(p);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    imageUrl: images[0]?.url ?? null,
    images: images.map((i) => ({ url: i.url, position: i.position })),
    category: { id: p.category.id, name: p.category.name, slug: p.category.slug },
    seller: { id: p.seller.id, shopName: p.seller.shopName },
    createdAt: p.createdAt,
  };
}

/** Shape returned to the owning seller: adds status and moderation. */
export const toOwnProduct = (p: Full) => ({ ...toPublicProduct(p), status: p.status, moderation: p.moderation, updatedAt: p.updatedAt });

export const pageMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});
