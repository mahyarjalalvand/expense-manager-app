const baseUrl = import.meta.env.VITE_BASE_URL;

export const getDashboard = async () => {
  const res = await fetch(`${baseUrl}dashboard`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return res.json();
};
