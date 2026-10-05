import { Route, Routes } from "react-router-dom";
import { routes } from "./routes/routes";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Budgets from "./pages/Budgets";
import NotFound from "./pages/NotFound";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path={routes.dashboard} element={<Dashboard />} />
            <Route path={routes.categories} element={<Categories />} />
            <Route path={routes.settings} element={<Settings />} />
            <Route path={routes.transactions} element={<Transactions />} />
            <Route path={routes.budgets} element={<Budgets />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
