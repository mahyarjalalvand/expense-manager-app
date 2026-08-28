import type { DashboardData } from "@/types/dashboard";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getDashboard = async (): Promise<DashboardData> => {
  const res = await fetch(`${baseUrl}dashboard`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  const data = await res.json();
  console.log(data);
  return data;
};
