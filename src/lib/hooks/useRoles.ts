import { useState, useEffect } from "react";
import { Role, RoleCreate, RoleUpdate, Permission } from "@/types/role";
import {
  getRoles,
  createRole as apiCreateRole,
  updateRole as apiUpdateRole,
  deleteRole as apiDeleteRole,
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissions,
} from "@/lib/api/roles";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissionsData = await getPermissions();
      setPermissions(permissionsData);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreateRole = async (roleData: RoleCreate) => {
    try {
      await apiCreateRole(roleData);
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleUpdateRole = async (id: string, updates: RoleUpdate) => {
    try {
      await apiUpdateRole(id, updates);
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await apiDeleteRole(id);
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleAssignPermission = async (
    roleId: string,
    permissionId: string,
  ) => {
    try {
      await assignPermissionToRole(roleId, permissionId);
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleRemovePermission = async (
    roleId: string,
    permissionId: string,
  ) => {
    try {
      await removePermissionFromRole(roleId, permissionId);
      await fetchRoles();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    roles,
    permissions,
    loading,
    error,
    createRole: handleCreateRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
    assignPermission: handleAssignPermission,
    removePermission: handleRemovePermission,
  };
}
