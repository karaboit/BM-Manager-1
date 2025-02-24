import { useState, useEffect } from "react";
import {
  getMedicalRecord,
  updateMedicalRecord,
  getClinicVisits,
  createClinicVisit,
  getMedicationSchedules,
  createMedicationSchedule,
  getMedicationLogs,
  getImmunizations,
  createImmunization,
} from "../api/medical";

export function useMedical(boarderId?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<any>(null);
  const [clinicVisits, setClinicVisits] = useState<any[]>([]);
  const [medicationSchedules, setMedicationSchedules] = useState<any[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<Record<string, any[]>>(
    {},
  );
  const [immunizations, setImmunizations] = useState<any[]>([]);

  useEffect(() => {
    if (boarderId) {
      fetchMedicalData();
    }
  }, [boarderId]);

  const fetchMedicalData = async () => {
    if (!boarderId) return;

    try {
      setLoading(true);
      setError(null);

      const [record, visits, schedules, immunizationData] = await Promise.all([
        getMedicalRecord(boarderId),
        getClinicVisits(boarderId),
        getMedicationSchedules(boarderId),
        getImmunizations(boarderId),
      ]);

      setMedicalRecord(record);
      setClinicVisits(visits);
      setMedicationSchedules(schedules);
      setImmunizations(immunizationData);

      // Fetch medication logs for each schedule
      const logs: Record<string, any[]> = {};
      for (const schedule of schedules) {
        logs[schedule.id] = await getMedicationLogs(schedule.id);
      }
      setMedicationLogs(logs);
    } catch (err) {
      console.error("Error fetching medical data:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (updates: any) => {
    if (!boarderId) return;

    try {
      const updated = await updateMedicalRecord(boarderId, updates);
      setMedicalRecord(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addClinicVisit = async (visit: any) => {
    try {
      const newVisit = await createClinicVisit({
        ...visit,
        boarder_id: boarderId,
      });
      setClinicVisits((prev) => [newVisit, ...prev]);
      return newVisit;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addMedicationSchedule = async (schedule: any) => {
    try {
      const newSchedule = await createMedicationSchedule({
        ...schedule,
        boarder_id: boarderId,
      });
      setMedicationSchedules((prev) => [newSchedule, ...prev]);
      return newSchedule;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addImmunization = async (immunization: any) => {
    try {
      const newImmunization = await createImmunization({
        ...immunization,
        boarder_id: boarderId,
      });
      setImmunizations((prev) => [newImmunization, ...prev]);
      return newImmunization;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    loading,
    error,
    medicalRecord,
    clinicVisits,
    medicationSchedules,
    medicationLogs,
    immunizations,
    updateRecord,
    addClinicVisit,
    addMedicationSchedule,
    addImmunization,
    refreshData: fetchMedicalData,
  };
}
