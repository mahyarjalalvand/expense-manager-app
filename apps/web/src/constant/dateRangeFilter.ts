export const dateRanges = [
  { label: "Select a range", value: null },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "This month", value: "month" },
  { label: "this year", value: "year" },
];
export type DateRange = (typeof dateRanges)[number]["value"];
