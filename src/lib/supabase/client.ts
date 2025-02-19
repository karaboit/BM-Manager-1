import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use environment variables
const supabaseUrl = "https://zgfpkvnrzskqnvibhihq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZnBrdm5yenNrcW52aWJoaWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NDkzMTAsImV4cCI6MjA1NTUyNTMxMH0.2TZKg9Xxz_WIWK5vbcP4172yekS2ANIM917iF5krmK8";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
