import type { DateRange } from "@/constant/dateRangeFilter";
import type { DashboardData } from "@/types/dashboard";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getDashboard = async (dateRange: DateRange): Promise<DashboardData> => {
  const res = await fetch(`${baseUrl}dashboard?range=${dateRange}`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  const data = await res.json();
  return data;
};
