import mongoose, { Document } from "mongoose";
import { Sale } from "../../models/sale.model";

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

export type CreateSaleInput = Pick<
  ISale,
  "items" | "grandTotal" | "createdBy" | "soldAt" | "isDeleted"
>;
export type UpdateSaleInput = Partial<CreateSaleInput>;
