import { z } from "zod";

export const disciplineRecordSchema = z.object({
  boarderId: z.string().uuid(),
  offense: z.string().min(1).max(500),
  category: z.enum(["Minor", "Major"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  punishment: z.string().optional(),
});

export const disciplineFilterSchema = z.object({
  boarderId: z.string().uuid().optional(),
  category: z.enum(["Minor", "Major"]).optional(),
  status: z.enum(["Pending", "Approved", "Completed", "Cancelled"]).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type DisciplineRecordInput = z.infer<typeof disciplineRecordSchema>;
export type DisciplineFilter = z.infer<typeof disciplineFilterSchema>;
