import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { getDashboardStats } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/stats",
  auth("Admin", "Manager", "Employee"),
  getDashboardStats,
);
