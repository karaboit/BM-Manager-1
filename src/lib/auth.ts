// Simple auth utilities
export const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

export const setAuthenticated = (value: boolean) => {
  localStorage.setItem("isAuthenticated", String(value));
};
