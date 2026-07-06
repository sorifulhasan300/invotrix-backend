import { Router } from "express";
import { upload } from "../../utils/upload.util";

import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import { Role } from "../../types/user.types";
import {
  createProductSchema,
  updateProductSchema,
} from "../../validations/product.validation";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDropdown,
  getSingleProduct,
  updateProduct,
} from "./product.controller";

export const productRouter = Router();

productRouter.get("/", auth(Role.Admin, Role.Manager, Role.Employee), getAllProducts);
productRouter.get(
  "/dropdown",
  auth(Role.Admin, Role.Manager, Role.Employee),
  getProductDropdown,
);
productRouter.post(
  "/",
  auth(Role.Admin, Role.Manager),
  validate(createProductSchema, "body"),
  upload.array("productImages", 5),
  createProduct,
);
productRouter.get(
  "/:id",
  auth(Role.Admin, Role.Manager, Role.Employee),
  getSingleProduct,
);
productRouter.patch(
  "/:id",
  auth(Role.Admin, Role.Manager),
  validate(updateProductSchema, "body"),
  upload.array("productImages", 5),
  updateProduct,
);
productRouter.delete("/:id", auth(Role.Admin), deleteProduct);




