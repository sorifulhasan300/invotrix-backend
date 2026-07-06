import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../types/user.types";
import { getDashboardStats } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/stats",
  auth(Role.Admin, Role.Manager, Role.Employee),
  getDashboardStats,
);
