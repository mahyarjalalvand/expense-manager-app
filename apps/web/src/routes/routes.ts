export const routes = {
  dashboard: "/",
  categories: "/categories",
  setting: "/setting",
  transactions: "/transactions",
};
export type AppRoute = (typeof routes)[keyof typeof routes];
