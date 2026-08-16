import { routes, type AppRoute } from "@/routes/routes";
import { LayoutDashboard, Receipt, Settings2Icon, Tags, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

type NavigationItem = {
  title: string;
  href: AppRoute;
  icon: LucideIcon;
};

function Sidebar() {
  const navigation: NavigationItem[] = [
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
      title: "setting",
      href: routes.setting,
      icon: Settings2Icon,
    },
  ];
  return (
    <aside className="flex flex-col border-r bg-background">
      <div className="flex py-5 items-center border-b px-6">
        <h1>expense manager</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
              }>
              <Icon className="size-4" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
