import { runDiagnostic } from "./diagnostic";

console.log("Running Supabase diagnostic...");

runDiagnostic().then((results) => {
  console.log("\nDiagnostic complete!");
  console.log("Connection status:", results.connection ? "Success" : "Failed");
  console.log("\nExisting tables:", results.tables.length);
  console.log("RLS policies:", results.policies.length);
  console.log("Permissions:", results.permissions.length);

  if (Object.keys(results.errors).length > 0) {
    console.log("\nErrors encountered:");
    Object.entries(results.errors).forEach(([key, error]) => {
      if (error) console.log(`- ${key}:`, error);
    });
  }
});
