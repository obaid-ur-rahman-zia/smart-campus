import { z } from "zod";

export const requestSchema = z.object({
  request_type: z.enum(["complaint", "document"]),
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(2000),
  category: z.string().min(2).max(80),
  priority: z.enum(["low", "medium", "high"]),
});

export const updateRequestSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "in_review", "approved", "rejected", "resolved"]),
  admin_note: z.string().max(600).optional(),
});

export type RequestInput = z.infer<typeof requestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
