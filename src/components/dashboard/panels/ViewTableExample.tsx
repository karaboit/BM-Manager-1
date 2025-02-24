import React from "react";
import { ViewTable } from "@/components/ViewTable";

export function ViewTableExample() {
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
  ];

  const data = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View Table Example</h1>
      <ViewTable columns={columns} data={data} />
    </div>
  );
}
