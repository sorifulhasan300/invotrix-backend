import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import sendResponse from "../../lib/sendResponse";

import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} from "../../utils/upload.util";
import {
  createProductIntoDB,
  deleteProductFromDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  getProductDropdownFromDB,
  updateProductInDB,
} from "./product.service";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../../types/product/product.interface";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Product images are required",
      );
    }

    const imageUrls = await uploadMultipleToCloudinary(req.files);

    const payload: CreateProductInput = {
      ...req.body,
      productImages: imageUrls,
    };

    const result = await createProductIntoDB(payload);

    sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Product created successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllProductsFromDB(
      req.query as unknown as Record<string, unknown>,
    );

    const { data, meta } = result;

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Products retrieved successfully",
      data,
      meta,
    );
  } catch (error) {
    next(error);
  }
};

export const getProductDropdown = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getProductDropdownFromDB();

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Dropdown products fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getSingleProductFromDB(req.params.id as string);

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Product retrieved successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updatePayload: UpdateProductInput = { ...req.body };

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = await uploadMultipleToCloudinary(req.files);
      updatePayload.productImages = imageUrls;
    }

    const result = await updateProductInDB(id as string, updatePayload);

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Product updated successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteProductFromDB(req.params.id as string);

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Product deleted successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  getProductDropdown,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
