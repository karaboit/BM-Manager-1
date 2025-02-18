import { z } from "zod";

export const boarderImportSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  grade: z.string().min(1, "Grade is required"),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  gender: z.enum(["M", "F", "Other"]),
  email: z.string().email("Invalid email format").optional(),
  medical_conditions: z.string().optional(),
  dietary_requirements: z.string().optional(),
  parent1_name: z.string().min(1, "Primary parent/guardian name is required"),
  parent1_relation: z
    .string()
    .min(1, "Primary parent/guardian relation is required"),
  parent1_email: z.string().email("Invalid parent email format"),
  parent1_phone: z.string().min(10, "Valid phone number required"),
  parent2_name: z.string().optional(),
  parent2_relation: z.string().optional(),
  parent2_email: z.string().email("Invalid email format").optional(),
  parent2_phone: z.string().min(10, "Valid phone number required").optional(),
  emergency_contact_name: z
    .string()
    .min(1, "Emergency contact name is required"),
  emergency_contact_relation: z
    .string()
    .min(1, "Emergency contact relation is required"),
  emergency_contact_phone: z
    .string()
    .min(10, "Valid emergency contact phone required"),
});

export type BoarderImport = z.infer<typeof boarderImportSchema>;

export const validateBoarderImport = (
  data: any,
): { success: boolean; errors?: string[] } => {
  try {
    boarderImportSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`,
        ),
      };
    }
    return { success: false, errors: ["Invalid data format"] };
  }
};
