import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: "Admin" | "Manager" | "Employee";
}

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "You are not authorized!" });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: "You have no permission to access this route",
        });
        return;
      }

      (req as any).user = decoded;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Invalid or Expired Token" });
    }
  };
};
