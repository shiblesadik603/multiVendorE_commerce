import { z } from "zod";

const httpUrl = z
  .string()
  .trim()
  .url("Enter a valid image URL")
  .max(2048)
  .refine((u) => /^https?:\/\//i.test(u), "Image URL must start with http:// or https://");

/** Price is an integer in minor units (19999 = 199.99). */
const price = z.number({ invalid_type_error: "Price must be a number" }).int("Price must be a whole number of minor units").min(1).max(100_000_000);

export const idParams = z.object({ id: z.string().uuid("Invalid id") });

export const publicListQuery = z
  .object({
    search: z.string().trim().max(100).optional(),
    category: z.string().trim().toLowerCase().max(100).optional(), // category slug
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
    sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: "minPrice cannot be greater than maxPrice",
    path: ["minPrice"],
  });

export const ownListQuery = z.object({
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const productFields = {
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().min(1, "Description is required").max(5000),
  price,
  categoryId: z.string().uuid("Invalid category").optional(),
  category: z.string().trim().toLowerCase().max(100).optional(), // slug, alternative to categoryId
  imageUrls: z.array(httpUrl).max(8, "At most 8 images").default([]),
};

export const createProductSchema = z.object(productFields).refine((p) => p.categoryId || p.category, {
  message: "categoryId or category (slug) is required",
  path: ["category"],
});

export const updateProductSchema = z
  .object({
    title: productFields.title,
    description: productFields.description,
    price: productFields.price,
    categoryId: productFields.categoryId,
    category: productFields.category,
    imageUrls: z.array(httpUrl).max(8, "At most 8 images"),
  })
  .partial()
  .refine((p) => Object.keys(p).length > 0, { message: "Nothing to update" });

export type PublicListQuery = z.infer<typeof publicListQuery>;
export type OwnListQuery = z.infer<typeof ownListQuery>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
