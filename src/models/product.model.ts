import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../types/product/product.interface.js";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: { type: String, required: true, trim: true },
    purchasePrice: {
      type: Number,
      required: true,
      min: [0, "Purchase price must be positive"],
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, "Selling price must be positive"],
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock quantity must be positive"],
    },
    productImages: { type: [String], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
