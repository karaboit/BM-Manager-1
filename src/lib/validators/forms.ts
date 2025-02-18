import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum([
    "System Administrator",
    "Director",
    "House Master",
    "Deputy House Master",
    "Support Staff",
    "Prefect",
    "Medical Staff",
    "Kitchen Staff",
    "Boarder Parent",
    "Boarder",
  ]),
  status: z.enum(["Active", "Inactive"]),
});

export const configFormSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  maintenanceMode: z.boolean(),
  emailNotifications: z.boolean(),
  maxLoginAttempts: z.number().min(1).max(10),
  sessionTimeout: z.number().min(5).max(120),
  modules: z.object({
    userManagement: z.boolean(),
    maintenance: z.boolean(),
    announcements: z.boolean(),
  }),
});

export const medicalRecordSchema = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
  allergies: z.array(z.string()),
  chronicConditions: z.array(z.string()),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
});

export const medicationSchema = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

export const leaveRequestSchema = z.object({
  boarderId: z.string().min(1, "Boarder ID is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required"),
  type: z.enum(["Family", "Medical", "Personal"]),
  parentApproval: z.boolean().optional(),
});

export const roomAllocationSchema = z.object({
  houseId: z.string().min(1, "House ID is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.number().min(1).max(4),
  boarderId: z.string().min(1, "Boarder ID is required"),
  startDate: z.string().min(1, "Start date is required"),
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type ConfigFormData = z.infer<typeof configFormSchema>;
export type MedicalRecordData = z.infer<typeof medicalRecordSchema>;
export type MedicationData = z.infer<typeof medicationSchema>;
export type LeaveRequestData = z.infer<typeof leaveRequestSchema>;
export type RoomAllocationData = z.infer<typeof roomAllocationSchema>;
