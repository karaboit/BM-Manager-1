import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export interface House {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useHouses() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHouses() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("houses")
          .select("*")
          .order("name");

        if (error) throw error;
        setHouses(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchHouses();
  }, []);

  return { houses, loading, error };
}
