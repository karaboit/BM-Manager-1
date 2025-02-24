import { apiClient } from "../api/apiClient";
import { handleApiError } from "../api/middleware/errorMiddleware";

export class BaseService<T> {
  constructor(protected tableName: string) {}

  async getAll(query?: string): Promise<T[]> {
    try {
      return await apiClient.get<T>(this.tableName, query);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: string, query?: string): Promise<T> {
    try {
      return await apiClient.getById<T>(this.tableName, id, query);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      // Store offline if no connection
      if (!navigator.onLine) {
        await apiClient.addToSyncQueue({
          table: this.tableName,
          type: "create",
          data,
        });
        throw new Error("Offline - changes will sync when online");
      }

      return await apiClient.create<T>(this.tableName, data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      // Store offline if no connection
      if (!navigator.onLine) {
        await apiClient.addToSyncQueue({
          table: this.tableName,
          type: "update",
          data: { id, ...data },
        });
        throw new Error("Offline - changes will sync when online");
      }

      return await apiClient.update<T>(this.tableName, id, data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Store offline if no connection
      if (!navigator.onLine) {
        await apiClient.addToSyncQueue({
          table: this.tableName,
          type: "delete",
          data: { id },
        });
        throw new Error("Offline - changes will sync when online");
      }

      await apiClient.delete(this.tableName, id);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  subscribe(callback: (payload: T) => void) {
    return apiClient.subscribe<T>(this.tableName, callback);
  }
}
