import { supabase } from "../client";

export async function createAnnouncement({
  title,
  content,
  priority,
  targetRoles,
  startDate,
  endDate,
}: {
  title: string;
  content: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  targetRoles: string[];
  startDate: string;
  endDate?: string;
}) {
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title,
      content,
      priority,
      target_roles: targetRoles,
      start_date: startDate,
      end_date: endDate,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acknowledgeAnnouncement(announcementId: string) {
  const { data, error } = await supabase
    .from("announcement_acknowledgments")
    .insert({
      announcement_id: announcementId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAnnouncements(userRole: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select(
      `
      *,
      creator:created_by(id, full_name),
      acknowledgments:announcement_acknowledgments(user_id)
    `,
    )
    .contains("target_roles", [userRole])
    .lte("start_date", new Date().toISOString())
    .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`);

  if (error) throw error;
  return data;
}

export async function getAnnouncementStats(announcementId: string) {
  const { data, error } = await supabase
    .from("announcement_acknowledgments")
    .select("user_id")
    .eq("announcement_id", announcementId);

  if (error) throw error;
  return {
    totalAcknowledgments: data.length,
  };
}
