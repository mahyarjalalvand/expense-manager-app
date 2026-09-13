import { createMiddleware } from "hono/factory";
import { auth } from "../auth.js";
import type { AppEnv } from "../types/hono.js";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  c.set("user", session.user);

  await next();
});
