import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { dashboardRouter } from "../modules/dashboard/dashboard.route";
import { productRouter } from "../modules/product/product.route";
import { salesRouter } from "../modules/sales/sales.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/dashboard", dashboardRouter);
router.use("/sales", salesRouter);

export default router;
