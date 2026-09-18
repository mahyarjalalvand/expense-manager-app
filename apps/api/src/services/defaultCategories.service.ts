import { db } from "../db/index.js";
import { categories } from "../db/schema/categories.js";

const defaultCategories = [
  {
    name: "Food",
    icon: "utensils",
    color: "#22c55e",
  },
  {
    name: "Transport",
    icon: "car",
    color: "#3b82f6",
  },
  {
    name: "Shopping",
    icon: "shopping-bag",
    color: "#a855f7",
  },
  {
    name: "Bills",
    icon: "receipt",
    color: "#f97316",
  },
  {
    name: "Entertainment",
    icon: "clapperboard",
    color: "#ec4899",
  },
  {
    name: "Salary",
    icon: "briefcase",
    color: "#10b981",
  },
  {
    name: "Freelance",
    icon: "laptop",
    color: "#6366f1",
  },
  {
    name: "Other Income",
    icon: "circle-dollar-sign",
    color: "#14b8a6",
  },
];
export const createDefaultCategories = async (userId: string) => {
  await db.insert(categories).values(
    defaultCategories.map((item) => ({
      ...item,
      userId,
    })),
  );
};
