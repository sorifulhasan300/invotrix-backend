import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envVars } from "../config/env.config";
import { Role } from "../types/user.types";

interface JwtPayload {
  id: string;
  role: Role;
}

export const auth = (...requiredRoles: Role[]) => {
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
        envVars.JWT_SECRET,
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
