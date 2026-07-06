import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  productImages: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = Pick<IProduct, "name" | "sku" | "category" | "purchasePrice" | "sellingPrice" | "stockQuantity" | "productImages">;
export type UpdateProductInput = Partial<CreateProductInput>;
