import { navigation } from "@/routes/routes";
import { useLocation } from "react-router-dom";

function Header() {
  const { pathname } = useLocation();
  const currentRouteTitle = navigation.find((item) => item.href === pathname)?.title;

  return (
    <header className="flex h-16 items-center border-b bg-background px-6">
      <h2 className="text-lg font-semibold">{currentRouteTitle}</h2>
    </header>
  );
}

export default Header;
