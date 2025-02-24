export interface MentorAssignment {
  id: string;
  mentor_id: string;
  boarder_id: string;
  start_date: string;
  end_date?: string;
  status: "active" | "ended";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MentorNote {
  id: string;
  mentor_id: string;
  boarder_id: string;
  note_text: string;
  next_steps?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}
