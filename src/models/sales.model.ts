import mongoose, { Schema, Document } from "mongoose";
import type { ISale, ISaleItem } from "./sales.interface.js";

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price per unit must be positive"],
    },
  },
  { _id: false },
);

const saleSchema = new Schema<ISale>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    products: {
      type: [saleItemSchema],
      required: [true, "Products are required"],
      validate: {
        validator: (products: ISaleItem[]) => products.length > 0,
        message: "Sale must have at least one product",
      },
    },
    grandTotal: {
      type: Number,
      required: [true, "Grand total is required"],
      min: [0, "Grand total must be positive"],
    },
    saleDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true },
);

export const Sale = mongoose.model<ISale>("Sale", saleSchema);
