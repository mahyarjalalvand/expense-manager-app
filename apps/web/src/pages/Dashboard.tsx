import IncomeExpenseChart from "@/components/ui/IncomeExpenseChart";
import RecentTransactions from "@/components/ui/RecentTransactions";
import SummaryCard from "@/components/ui/SummaryCard";
import { useDashboard } from "@/hooks/useDashboard";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

function Dashboard() {
  const { data, isPending, isError } = useDashboard();
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load dashboard</div>;
  }
  return (
    <div>
      <p className="text-muted-foreground">overview of your financial activity</p>
      <div className="w-full grid gap-4 md:grid-cols-3 mt-5">
        <SummaryCard title="Income" variant="income" icon={ArrowDownLeft} value={data?.summary.income} description="Total income this month" />
        <SummaryCard title="Expense" variant="expense" icon={ArrowUpRight} value={data?.summary.expenses} description="Total expenses this month" />
        <SummaryCard title="Balance" variant="balance" icon={Wallet} value={data?.summary.balance} description="Remaining balance this month" />
      </div>
      <div className="my-6 w-full min-w-0 overflow-hidden">
        <IncomeExpenseChart data={data.dailyData} />
      </div>
      <div>
        <RecentTransactions data={data.recentTransactions} />
      </div>
    </div>
  );
}

export default Dashboard;
