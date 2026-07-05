import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z
    .custom<Express.Multer.File>((val) => val === undefined || typeof val === "object")
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Profile image must be under 5MB"),
  role: z
    .enum(["Admin", "Manager", "Employee"])
    .optional()
    .default("Employee"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
