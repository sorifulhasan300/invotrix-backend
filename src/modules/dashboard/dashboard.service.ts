import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { Product } from "../../models/product.model";
import { Sale } from "../../models/sale.model";

export interface LowStockProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  stockQuantity: number;
}

export interface TotalSales {
  count: number;
  totalRevenue: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: TotalSales;
  lowStockProducts: LowStockProduct[];
}

export const getDashboardStatsFromDB = async (): Promise<DashboardStats> => {
  const [totalProducts, lowStockProducts, salesAggregate] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Product.find({ stockQuantity: { $lt: 5 }, isDeleted: false }).lean(),
    Sale.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalRevenue: { $sum: "$grandTotal" },
        },
      },
    ]),
  ]);

  const totalCustomers = await Sale.distinct("createdBy", {
    isDeleted: false,
  }).then((ids) =>
    ids.filter((id) => mongoose.isValidObjectId(id)).length,
  );

  const totalSales: TotalSales =
    salesAggregate.length > 0
      ? {
          count: salesAggregate[0].count,
          totalRevenue: salesAggregate[0].totalRevenue,
        }
      : { count: 0, totalRevenue: 0 };

  return {
    totalProducts,
    totalCustomers,
    totalSales,
    lowStockProducts: lowStockProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      stockQuantity: p.stockQuantity,
    })),
  };
};
