import z from "zod";

export const dateRangeSchema = z.enum(["7d", "30d", "month", "year"]);
export type DateRange = z.infer<typeof dateRangeSchema>;
