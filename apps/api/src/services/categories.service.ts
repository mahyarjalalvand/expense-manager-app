import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema/categories.js";

export const getCategories = async (userId: string) => {
  return db.select().from(categories).where(eq(categories.userId, userId));
};

export const createCategory = async (userId: string, data: { name: string; icon?: string; color?: string }) => {
  const result = await db.insert(categories).values({ userId, name: data.name, icon: data.icon, color: data.color }).returning();
  return result[0];
};
