import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { productRouter } from "../modules/product/product.route";
import { salesRouter } from "../modules/sales/sales.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/sales", salesRouter);

export default router;
