export interface Leave {
  id: string;
  boarder_id: string;
  type: "weekend" | "holiday" | "medical" | "emergency" | "other";
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending_parent" | "pending_house_master" | "approved" | "rejected";
  parent_approval_date?: string;
  house_master_approval_date?: string;
  created_at: string;
  updated_at: string;
}
