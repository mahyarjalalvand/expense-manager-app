import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import { createDefaultCategories } from "./services/defaultCategories.service.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: ["http://localhost:5173", "https://expense-manager-8w4359ofw-self-cd1d.vercel.app"],
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createDefaultCategories(user.id);
        },
      },
    },
  },
});
