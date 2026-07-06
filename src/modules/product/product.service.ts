import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../utils/AppError";
import type {
  IProduct,
  CreateProductInput,
  UpdateProductInput,
} from "../../types/product/product.interface.js";
import { Product } from "../../models/product.model";

const buildProductQuery = (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.name && typeof query.name === "string") {
    filter.name = { $regex: query.name, $options: "i" };
  }

  if (query.sku && typeof query.sku === "string") {
    filter.sku = { $regex: query.sku, $options: "i" };
  }

  if (query.category && typeof query.category === "string") {
    filter.category = { $regex: query.category, $options: "i" };
  }

  const sortBy = typeof query.sortBy === "string" ? query.sortBy : "createdAt";
  const sortOrder =
    typeof query.sortOrder === "string" &&
    query.sortOrder.toLowerCase() === "desc"
      ? -1
      : 1;
  const page =
    typeof query.page === "number" && query.page > 0 ? query.page : 1;
  const limit =
    typeof query.limit === "number" && query.limit > 0 ? query.limit : 10;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

  return { filter, sort, page, limit, skip };
};

export const createProductIntoDB = async (payload: CreateProductInput) => {
  const product = await Product.create(payload);
  return product;
};

export const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const { filter, sort, page, limit, skip } = buildProductQuery(query);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / limit);

  return {
    meta: { total, page, limit, pages },
    data: products,
  };
};

export const getSingleProductFromDB = async (id: string) => {
  try {
    const product = await Product.findOne({ _id: id, isDeleted: false });

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return product;
  } catch (error) {
    if (mongoose.isValidObjectId(id) && error instanceof Error) {
      throw error;
    }
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
};

export const updateProductInDB = async (
  id: string,
  payload: UpdateProductInput,
) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true },
    );
    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return product;
  } catch (error) {
    if (mongoose.isValidObjectId(id) && error instanceof Error) {
      throw error;
    }
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
};

export const deleteProductFromDB = async (id: string) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return product;
  } catch (error) {
    if (mongoose.isValidObjectId(id) && error instanceof Error) {
      throw error;
    }
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
};
