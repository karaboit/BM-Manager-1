export type UserRole =
  | "System Administrator"
  | "Director"
  | "House Master"
  | "Deputy House Master"
  | "Support Staff"
  | "Prefect"
  | "Medical Staff"
  | "Kitchen Staff"
  | "Boarder Parent"
  | "Boarder";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
}

export interface DisciplinaryRecord {
  id: string;
  boarderId: string;
  date: string;
  offense: string;
  category: "Minor" | "Major";
  punishment?: string;
  status: "Pending" | "Approved" | "Completed";
  reportedBy: string;
  approvedBy?: string;
}

export interface Leave {
  id: string;
  boarderId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: "Family" | "Medical" | "Personal";
  status: "Pending Parent" | "Pending House Master" | "Approved" | "Rejected";
  approvedByParent?: boolean;
  approvedByHouseMaster?: boolean;
  parentApprovalDate?: string;
  houseMasterApprovalDate?: string;
}

export interface ClinicVisit {
  visit_id: string;
  boarder_id: string;
  visit_date: string;
  reason: string;
  vitals: {
    temperature: number;
    blood_pressure: string;
    pulse: number;
  };
  treatment: string;
  staff_id: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalInfo {
  medical_info_id: string;
  boarder_id: string;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contact: string;
  created_at: string;
  updated_at: string;
}

export interface WellbeingSurvey {
  survey_id: string;
  boarder_id: string;
  created_at: string;
  responses: {
    mood: number;
    sleep: number;
    stress: boolean;
    loneliness: number;
    physical_discomfort: boolean;
  };
  risk_score?: number;
}
