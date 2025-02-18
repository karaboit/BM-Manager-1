import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationError } from "./errorMiddleware";

export const withAuth = async <T>(request: () => Promise<T>): Promise<T> => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  try {
    const token = await getAccessTokenSilently();
    return await request();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      loginWithRedirect();
    }
    throw error;
  }
};

export const getAuthHeader = async () => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  return { Authorization: `Bearer ${token}` };
};
