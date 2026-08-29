import { Route, Routes } from "react-router-dom";
import { routes } from "./routes/routes";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import { Settings } from "lucide-react";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Routes>
          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.categories} element={<Categories />} />
          <Route path={routes.settings} element={<Settings />} />
          <Route path={routes.transactions} element={<Transactions />} />
        </Routes>
        <Toaster />
      </AppLayout>
    </QueryClientProvider>
  );
}

export default App;
