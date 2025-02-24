import { useState, useEffect } from "react";
import {
  getHouses,
  createHouse,
  updateHouse,
  deleteHouse,
} from "../api/houses";

export function useHouses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch houses on mount
  useEffect(() => {
    fetchHouses();
  }, []);

  async function fetchHouses() {
    try {
      setLoading(true);
      const data = await getHouses();
      setHouses(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching houses:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateHouse(data: { name: string; capacity: number }) {
    try {
      const newHouse = await createHouse(data);
      setHouses((prev) => [...prev, newHouse]);
      return newHouse;
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  async function handleUpdateHouse(
    id: string,
    data: { name?: string; capacity?: number },
  ) {
    try {
      const updatedHouse = await updateHouse(id, data);
      setHouses((prev) =>
        prev.map((house) => (house.id === id ? updatedHouse : house)),
      );
      return updatedHouse;
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  async function handleDeleteHouse(id: string) {
    try {
      await deleteHouse(id);
      setHouses((prev) => prev.filter((house) => house.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  return {
    houses,
    loading,
    error,
    createHouse: handleCreateHouse,
    updateHouse: handleUpdateHouse,
    deleteHouse: handleDeleteHouse,
    refreshHouses: fetchHouses,
  };
}
