import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default AppLayout;
