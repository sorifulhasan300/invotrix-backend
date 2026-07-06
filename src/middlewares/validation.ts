import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

type ValidationSource = "body" | "query" | "params";

export const validate = (
  schema: ZodObject,
  source: ValidationSource = "body",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const parsed = await schema.parseAsync(data);
      req[source] = parsed as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error during validation",
        });
      }
    }
  };
};
