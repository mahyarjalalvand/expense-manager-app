import { navigation } from "@/routes/routes";
import { NavLink } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
function Sidebar() {
  return (
    <ShadcnSidebar side="left" collapsible="icon">
      <SidebarHeader className="border-b px-6 py-5 group-data-[collapsible=icon]:px-2">
        <h1 className="font-semibold truncate group-data-[collapsible=icon]:hidden">expense manager</h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton className="py-6">
                      <NavLink to={item.href} className="flex items-center gap-2">
                        {({ isActive }) => (
                          <>
                            <Icon />
                            <span className={isActive ? "font-medium text-primary" : ""}>{item.title}</span>
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}

export default Sidebar;
