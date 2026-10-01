import type { DateRange } from "../schemas/dateRange.js";

export const getDateRange = (range: DateRange) => {
  const now = new Date();
  switch (range) {
    case "7d": {
      const endDate = new Date(now);
      endDate.setHours(24, 0, 0, 0);
      const startDate = new Date(endDate);
      startDate.setDate(now.getDate() - 7);
      return {
        startDate,
        endDate,
      };
    }
    case "30d": {
      const endDate = new Date(now);
      endDate.setHours(24, 0, 0, 0);
      const startDate = new Date(endDate);
      startDate.setDate(now.getDate() - 30);
      return {
        startDate,
        endDate,
      };
    }
    case "month": {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return {
        startDate,
        endDate,
      };
    }
    case "year": {
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear() + 1, 0, 1);
      return {
        startDate,
        endDate,
      };
    }
  }
};
