import { Hono } from "hono";

const transactionsRoutes = new Hono();

transactionsRoutes.get("/", (c) => {
  const { type, category } = c.req.query();
  return c.json({
    type,
    category,
  });
});

transactionsRoutes.get(":id", (c) => {
  const id = c.req.param("id");
  return c.json({
    id,
    message: "transaction found",
  });
});
export default transactionsRoutes;
