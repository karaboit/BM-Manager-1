function processUserData(data: any[]) {
  return data.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role?.role_key || "",
    status: user.status || "",
    phone: user.phone || "",
    emergency_contact: user.emergency_contact || "",
    created_at: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "",
    updated_at: user.updated_at
      ? new Date(user.updated_at).toLocaleDateString()
      : "",
  }));
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  // Get headers from first object
  const processedData = processUserData(data);
  const headers = Object.keys(processedData[0]);

  // Convert data to CSV format
  const csv = [
    headers.join(","), // Header row
    ...processedData.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(","),
    ),
  ].join("\n");

  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
