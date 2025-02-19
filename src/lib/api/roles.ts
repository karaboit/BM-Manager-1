import { supabase } from "../supabase/client";
import { Role, RoleCreate, RoleUpdate } from "@/types/role";

export async function getRoles() {
  const { data: roles, error } = await supabase
    .from("roles")
    .select("*, role_permissions(permission_id, permissions(*))");

  if (error) throw error;
  return roles;
}

export async function createRole(role: RoleCreate) {
  const { data, error } = await supabase
    .from("roles")
    .insert(role)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRole(id: string, updates: RoleUpdate) {
  const { data, error } = await supabase
    .from("roles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRole(id: string) {
  // First delete role_permissions entries
  await supabase.from("role_permissions").delete().eq("role_id", id);

  // Then delete the role
  const { error } = await supabase.from("roles").delete().eq("id", id);
  if (error) throw error;
}

export async function assignPermissionToRole(
  roleId: string,
  permissionId: string,
) {
  const { error } = await supabase
    .from("role_permissions")
    .insert({ role_id: roleId, permission_id: permissionId });

  if (error) throw error;
}

export async function removePermissionFromRole(
  roleId: string,
  permissionId: string,
) {
  const { error } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId)
    .eq("permission_id", permissionId);

  if (error) throw error;
}

export async function getPermissions() {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}
