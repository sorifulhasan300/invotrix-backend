import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validation";
import { Role } from "../../types/user.types";
import { createSaleSchema } from "../../validations/sales.validation";
import { createSale } from "./sales.controller";

export const salesRouter = Router();

salesRouter.post(
  "/",
  auth(Role.Admin, Role.Manager, Role.Employee),
  validate(createSaleSchema, "body"),
  createSale,
);
