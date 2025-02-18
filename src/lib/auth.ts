import { Auth0Provider, Auth0ProviderOptions } from "@auth0/auth0-react";

export const auth0Config: Auth0ProviderOptions = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "dev-example.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id",
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};

export const AuthProvider = Auth0Provider;
