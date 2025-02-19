import { z } from "zod";

export const leaveRequestSchema = z.object({
  boarderId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["Medical", "Family", "Academic", "Other"]),
  reason: z.string().min(1).max(500),
});

export const leaveFilterSchema = z.object({
  boarderId: z.string().uuid().optional(),
  status: z
    .enum(["Pending Parent", "Pending House Master", "Approved", "Rejected"])
    .optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type LeaveFilter = z.infer<typeof leaveFilterSchema>;
