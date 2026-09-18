import { navigation } from "@/routes/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function Header() {
  const { pathname } = useLocation();
  const currentRouteTitle = navigation.find((item) => item.href === pathname)?.title;

  const navigate = useNavigate();

  const logoutHandler = async () => {
    await authClient.signOut();
    navigate("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h2 className="text-lg font-semibold">{currentRouteTitle}</h2>
      <Button onClick={logoutHandler} className="bg-red-500 text-white">
        <LogOut />
      </Button>
    </header>
  );
}

export default Header;
