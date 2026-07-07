import { z } from "zod";

export const saleItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be positive"),
});

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Sale must have at least one product"),
  totalAmount: z.coerce.number().min(0, "Grand total must be positive"),
  soldAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional().default(false),
});

export const updateSaleSchema = z.object({
  items: z
    .array(saleItemSchema)
    .min(1, "Sale must have at least one product")
    .optional(),
  totalAmount: z.coerce
    .number()
    .min(0, "Grand total must be positive")
    .optional(),
  soldAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
});
