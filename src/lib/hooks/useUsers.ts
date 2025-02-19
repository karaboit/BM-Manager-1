import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { getUsers, updateUser, deleteUser, createUser } from "../api/users";
import { User, UserCreate, UserUpdate } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId: string, updates: UserUpdate) => {
    try {
      // If updating house_id, verify it exists or is null
      if ("house_id" in updates && updates.house_id) {
        const { data: house } = await supabase
          .from("houses")
          .select("id")
          .eq("id", updates.house_id)
          .single();

        if (!house) {
          throw new Error("Invalid house selected");
        }
      }

      await updateUser(userId, updates);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleCreateUser = async (userData: UserCreate) => {
    try {
      await createUser(userData);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    createUser: handleCreateUser,
  };
}
