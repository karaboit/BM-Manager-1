export interface Boarder {
  id: string;
  name: string;
  grade: string;
  house_id: string;
  status: "Active" | "Inactive";
  created_at: string;
  updated_at: string;
}

export interface BoarderImport {
  name: string;
  grade: string;
  email?: string;
  parent_email?: string;
  parent_phone?: string;
  emergency_contact?: string;
}
