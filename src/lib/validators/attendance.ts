import { z } from "zod";

export const attendanceSchema = z.object({
  boarderId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rollCallType: z.enum(["Morning", "Afternoon", "Evening"]),
  status: z.enum(["Present", "Late", "Absent", "Excused"]),
  reason: z.string().optional(),
});

export const attendanceFilterSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  boarderId: z.string().uuid().optional(),
  status: z.enum(["Present", "Late", "Absent", "Excused"]).optional(),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type AttendanceFilter = z.infer<typeof attendanceFilterSchema>;
