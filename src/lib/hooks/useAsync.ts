import { useState, useCallback } from "react";

export function useAsync<T, E = string>(asyncFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction();
      setData(response);
      return response;
    } catch (e) {
      setError(e as E);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, data, error };
}
