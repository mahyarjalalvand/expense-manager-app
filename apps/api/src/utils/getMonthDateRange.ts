export const getMonthDateRange = (year: number, month: number) => ({
  startDate: new Date(Date.UTC(year, month - 1, 1)),
  endDate: new Date(Date.UTC(year, month, 1)),
});
