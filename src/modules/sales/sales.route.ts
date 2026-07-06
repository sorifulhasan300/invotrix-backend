import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import { createSaleSchema } from "../../validations/sales.validation";
import { createSale } from "./sales.controller";

export const salesRouter = Router();

salesRouter.post(
  "/",
  auth("Admin", "Manager", "Employee"),
  validate(createSaleSchema, "body"),
  createSale,
);
