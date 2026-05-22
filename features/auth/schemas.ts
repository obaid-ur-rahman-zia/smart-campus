import { z } from "zod";

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name is required"),
    email: z.string().trim().email("Enter a valid university email"),
    roll_number: z.string().trim().optional(),
    department: z.string().trim().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
