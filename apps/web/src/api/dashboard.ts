import type { DateRange } from "@/constant/dateRangeFilter";
import type { DashboardData } from "@/types/dashboard";
import { api } from "@/utils/api";

export const getDashboard = async (dateRange: DateRange): Promise<DashboardData> => {
  const res = await api(`dashboard?range=${dateRange}`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  const data = await res.json();
  return data;
};
