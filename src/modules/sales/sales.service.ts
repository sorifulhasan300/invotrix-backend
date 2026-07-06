import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { Product } from "../../models/product.model";
import { Sale } from "../../models/sale.model";
import type { CreateSaleInput } from "../../types/sels/sales.interface.js";

export const createSaleInDB = async (payload: CreateSaleInput, createdBy: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let grandTotal = 0;

    for (const item of payload.items) {
      if (!mongoose.isValidObjectId(item.product)) {
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
      }

      const product = await Product.findOne({
        _id: item.product,
        isDeleted: false,
      }).session(session);

      if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient stock");
      }

      grandTotal += item.quantity * item.sellingPrice;

      product.stockQuantity -= item.quantity;
      await product.save({ session });
    }

    const [sale] = await Sale.create(
      [
        {
          items: payload.items,
          grandTotal,
          createdBy,
        },
      ],
      { session },
    );

    const populatedSale = await Sale.findById(sale._id)
      .populate("items.product")
      .session(session)
      .lean();

    await session.commitTransaction();
    session.endSession();

    return populatedSale;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
