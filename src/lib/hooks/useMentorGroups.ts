import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export interface MentorGroup {
  id: string;
  name: string;
  leader_id: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive";
  leader?: {
    id: string;
    full_name: string;
    email: string;
  };
  members?: Array<{
    id: string;
    full_name: string;
    email: string;
  }>;
}

export function useMentorGroups() {
  const [groups, setGroups] = useState<MentorGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mentor_groups")
        .select(
          `
          *,
          leader:users!mentor_groups_leader_id_fkey(id, full_name, email),
          members:mentor_group_members(boarder:users(id, full_name, email))
        `,
        )
        .eq("status", "active");

      if (error) throw error;
      setGroups(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async ({
    name,
    leaderId,
    boarderIds,
  }: {
    name: string;
    leaderId: string;
    boarderIds: string[];
  }) => {
    try {
      // Create group
      const { data: group, error: groupError } = await supabase
        .from("mentor_groups")
        .insert({ name, leader_id: leaderId })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add members
      const memberRows = boarderIds.map((boarderId) => ({
        group_id: group.id,
        boarder_id: boarderId,
      }));

      const { error: membersError } = await supabase
        .from("mentor_group_members")
        .insert(memberRows);

      if (membersError) throw membersError;

      await fetchGroups(); // Refresh groups
      return group;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateGroup = async (
    groupId: string,
    updates: { name?: string; leaderId?: string; status?: string },
  ) => {
    try {
      const { data, error } = await supabase
        .from("mentor_groups")
        .update({
          name: updates.name,
          leader_id: updates.leaderId,
          status: updates.status,
        })
        .eq("id", groupId)
        .select()
        .single();

      if (error) throw error;
      await fetchGroups(); // Refresh groups
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateMembers = async (groupId: string, boarderIds: string[]) => {
    try {
      // First remove all current members
      await supabase
        .from("mentor_group_members")
        .update({ status: "inactive" })
        .eq("group_id", groupId);

      // Add new members
      const memberRows = boarderIds.map((boarderId) => ({
        group_id: groupId,
        boarder_id: boarderId,
      }));

      const { error } = await supabase
        .from("mentor_group_members")
        .insert(memberRows);

      if (error) throw error;
      await fetchGroups(); // Refresh groups
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    updateMembers,
    refreshGroups: fetchGroups,
  };
}
