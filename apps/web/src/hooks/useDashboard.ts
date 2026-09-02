import { getDashboard } from "@/api/dashboard";
import type { DateRange } from "@/constant/dateRangeFilter";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ["dashboard", dateRange],
    queryFn: () => getDashboard(dateRange),
  });
};
