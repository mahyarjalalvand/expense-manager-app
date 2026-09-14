export const api = async (path: string, options?: RequestInit) => {
  return fetch(`${import.meta.env.VITE_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });
};
