import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  targetRoles: z.array(z.string()),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
    .optional(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
