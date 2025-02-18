import {
  ApiError,
  ValidationError,
  handleError,
} from "./middleware/errorMiddleware";
import { withAuth, getAuthHeader } from "./middleware/authMiddleware";

type FetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
};

const BASE_URL = import.meta.env.VITE_API_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 422) {
      throw new ValidationError(data.errors);
    }

    if (response.status === 401) {
      throw new ApiError(
        response.status,
        "Authentication required",
        "AUTH_REQUIRED",
      );
    }

    throw new ApiError(
      response.status,
      data.message || "An error occurred",
      data.code,
    );
  }

  return data;
}

export async function apiClient(endpoint: string, options: FetchOptions = {}) {
  const url = `${BASE_URL}${endpoint}`;
  let headers = { ...defaultHeaders, ...options.headers };

  const makeRequest = async () => {
    if (options.requiresAuth) {
      const authHeader = await getAuthHeader();
      headers = { ...headers, ...authHeader };
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      return handleResponse(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  return options.requiresAuth ? withAuth(makeRequest) : makeRequest();
}
