import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { productRouter } from "../modules/product/product.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);

export default router;
