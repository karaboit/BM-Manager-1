import { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser, createUser } from "../api/users";
import { User, UserCreate, UserUpdate } from "@/types/user";
import { DEFAULT_USERS } from "@/lib/utils/roles";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching users...");

      // In development, just use mock data
      if (import.meta.env.DEV) {
        console.log("Using mock data in development");
        setUsers(DEFAULT_USERS);
        return;
      }

      // Try database
      try {
        const data = await getUsers();
        if (!data?.length) {
          console.warn("No users found in DB, using mock data");
          setUsers(DEFAULT_USERS);
          return;
        }
        setUsers(data);
      } catch (err) {
        console.warn("DB error, using mock data:", err);
        setUsers(DEFAULT_USERS);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: UserCreate) => {
    try {
      const newUser = await createUser(userData);
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err as Error);
      throw err;
    }
  };

  const handleUpdateUser = async (userId: string, updates: UserUpdate) => {
    try {
      const updatedUser = await updateUser(userId, updates);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user)),
      );
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err as Error);
      throw err;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err as Error);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
  };
}
