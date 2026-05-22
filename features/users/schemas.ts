import { z } from "zod";

export const roleUpdateSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["student", "teacher", "staff", "admin"]),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(80),
  rollNumber: z.string().trim().max(40).optional(),
  department: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z
    .union([z.literal(""), z.string().url(), z.string().regex(/^data:image\//, "Invalid image format.")])
    .optional(),
});

export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
