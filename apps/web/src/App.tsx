import { Route, Routes } from "react-router-dom";
import { routes } from "./routes/routes";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Setting from "./pages/Setting";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.categories} element={<Categories />} />
        <Route path={routes.setting} element={<Setting />} />
        <Route path={routes.transactions} element={<Transactions />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
