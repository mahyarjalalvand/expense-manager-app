import { ChartNoAxesColumnIncreasing, LayoutDashboard, Receipt, Settings2Icon, Tags, type LucideIcon } from "lucide-react";

export const routes = {
  dashboard: "/",
  categories: "/categories",
  settings: "/settings",
  transactions: "/transactions",
  budgets: "/budgets",
  register: "/register",
  login: "/login",
};

export type AppRoute = (typeof routes)[keyof typeof routes];

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: routes.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "transactions",
    href: routes.transactions,
    icon: Receipt,
  },
  {
    title: "categories",
    href: routes.categories,
    icon: Tags,
  },
  {
    title: "Budgets",
    href: routes.budgets,
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "settings",
    href: routes.settings,
    icon: Settings2Icon,
  },
];
export type NavigationItem = {
  title: string;
  href: AppRoute;
  icon: LucideIcon;
};
