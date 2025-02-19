import { PostgrestError } from "@supabase/supabase-js";
import {
  ValidationError,
  DatabaseError,
  AuthorizationError,
  NotFoundError,
} from "../validators/errors";

export function handleError(error: unknown): never {
  if (error instanceof ValidationError) {
    throw error;
  }

  if (error instanceof AuthorizationError) {
    throw error;
  }

  if (error instanceof NotFoundError) {
    throw error;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const pgError = error as PostgrestError;
    switch (pgError.code) {
      case "23505": // unique_violation
        throw new DatabaseError("Record already exists");
      case "23503": // foreign_key_violation
        throw new DatabaseError("Referenced record does not exist");
      case "42P01": // undefined_table
        throw new DatabaseError("Table does not exist");
      case "42501": // insufficient_privilege
        throw new AuthorizationError("Insufficient permissions");
      default:
        throw new DatabaseError(`Database error: ${pgError.message}`);
    }
  }

  throw new Error("An unexpected error occurred");
}

export function handleDatabaseResponse<T>(
  data: T | null,
  error: PostgrestError | null,
): T {
  if (error) {
    handleError(error);
  }
  if (!data) {
    throw new NotFoundError("Record not found");
  }
  return data;
}
