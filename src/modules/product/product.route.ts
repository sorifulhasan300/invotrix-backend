import { Router } from "express";
import { upload } from "../../utils/upload.util";

import { auth } from "../../middlewares/auth";
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
  upload.array("productImages", 5),
  updateProduct,
);
productRouter.delete("/:id", auth("Admin"), deleteProduct);



