import mongoose, { Schema, Document } from "mongoose";

export interface ISaleItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  sellingPrice: number;
}

export interface ISale extends Document {
  items: ISaleItem[];
  grandTotal: number;
  createdBy: mongoose.Types.ObjectId;
  soldAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    sellingPrice: { type: Number, required: true, min: [0, "Selling price must be positive"] },
  },
  { _id: false },
);

const saleSchema = new Schema<ISale>(
  {
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items: ISaleItem[]) => items.length > 0,
        message: "Sale must have at least one product",
      },
    },
    grandTotal: { type: Number, required: true, min: [0, "Grand total must be positive"] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    soldAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Sale = mongoose.model<ISale>("Sale", saleSchema);
