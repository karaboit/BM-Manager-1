import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
  location: z.string().min(1).max(200),
  maxParticipants: z.number().int().positive(),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  boarderId: z.string().uuid(),
  packedMeals: z.array(z.string()).optional(),
});

export const eventFilterSchema = z.object({
  status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
export type EventFilter = z.infer<typeof eventFilterSchema>;
