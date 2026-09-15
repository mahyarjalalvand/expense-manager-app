import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.js";
import { createCategory, getCategories, updateCategory } from "../services/categories.service.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/categories.js";

export const categoriesRoutes = new Hono();

categoriesRoutes.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const result = await getCategories(user.id);
  return c.json(result);
});

categoriesRoutes.post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = c.req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ message: "Invalid category data", errors: parsed.error.message }, 400);
  }
  const result = await createCategory(user.id, parsed.data);
  return c.json(result, 201);
});
categoriesRoutes.patch("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const categoryId = c.req.param("id");
  const body = await c.req.json();

  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        message: "Invalid category data",
        errors: parsed.error.message,
      },
      400,
    );
  }
  const result = updateCategory(user.id, categoryId, parsed.data);
  if (!result) {
    return c.json(
      {
        message: "Category not fount",
      },
      404,
    );
  }

  return c.json(result);
});
