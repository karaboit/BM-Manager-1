import { supabase } from "./client";

export async function createPermissionsTables() {
  try {
    const { error } = await supabase.from("permissions").insert([
      {
        name: "manage_users",
        description: "Can create, update, and delete users",
      },
      {
        name: "manage_roles",
        description: "Can create, update, and delete roles",
      },
      {
        name: "manage_houses",
        description: "Can create, update, and delete houses",
      },
      {
        name: "manage_rooms",
        description: "Can create, update, and delete rooms",
      },
      {
        name: "manage_beds",
        description: "Can create, update, and delete beds",
      },
      {
        name: "manage_medical",
        description: "Can access and manage medical records",
      },
      {
        name: "manage_kitchen",
        description: "Can access and manage kitchen operations",
      },
      {
        name: "manage_attendance",
        description: "Can manage attendance records",
      },
      {
        name: "manage_discipline",
        description: "Can manage disciplinary records",
      },
      { name: "manage_leave", description: "Can manage leave requests" },
      { name: "manage_events", description: "Can create and manage events" },
      {
        name: "manage_maintenance",
        description: "Can manage maintenance requests",
      },
      { name: "view_reports", description: "Can view system reports" },
      { name: "manage_system", description: "Can manage system settings" },
    ]);

    if (error) {
      console.error("Error creating permissions:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating permissions tables:", error);
    return false;
  }
}
