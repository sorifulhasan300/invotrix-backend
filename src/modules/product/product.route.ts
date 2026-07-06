import { Router } from "express";
import { upload } from "../../utils/upload.util";

import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import {
  createProductSchema,
  updateProductSchema,
} from "../../validations/product.validation";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "./product.controller";

export const productRouter = Router();

productRouter.get("/", auth("Admin", "Manager", "Employee"), getAllProducts);
productRouter.post(
  "/",
  auth("Admin", "Manager"),
  validate(createProductSchema, "body"),
  upload.array("productImages", 5),
  createProduct,
);
productRouter.get(
  "/:id",
  auth("Admin", "Manager", "Employee"),
  getSingleProduct,
);
productRouter.patch(
  "/:id",
  auth("Admin", "Manager"),
  validate(updateProductSchema, "body"),
  upload.array("productImages", 5),
  updateProduct,
);
productRouter.delete("/:id", auth("Admin"), deleteProduct);




