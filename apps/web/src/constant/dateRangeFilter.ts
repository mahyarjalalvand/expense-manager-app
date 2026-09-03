export const dateRanges = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "This month", value: "month" },
  { label: "this year", value: "year" },
] as const;
export type DateRange = (typeof dateRanges)[number]["value"];
