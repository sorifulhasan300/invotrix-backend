import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { createSale } from "./sales.controller";

export const salesRouter = Router();

salesRouter.post("/", auth("Admin", "Manager", "Employee"), createSale);
