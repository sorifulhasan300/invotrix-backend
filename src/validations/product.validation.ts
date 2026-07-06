import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be positive"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be positive"),
  stockQuantity: z.coerce.number().min(0, "Stock quantity must be positive").default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  sku: z.string().min(1, "SKU is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be positive").optional(),
  sellingPrice: z.coerce.number().min(0, "Selling price must be positive").optional(),
  stockQuantity: z.coerce.number().min(0, "Stock quantity must be positive").optional(),
});

