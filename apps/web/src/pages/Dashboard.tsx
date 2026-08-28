import SummaryCard from "@/components/ui/SummaryCard";
import { useDashboard } from "@/hooks/useDashboard";

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
        <SummaryCard title="Income" value={data?.summary.income} />
        <SummaryCard title="Expense" value={data?.summary.expenses} />
        <SummaryCard title="Balance" value={data?.summary.balance} />
      </div>
    </div>
  );
}

export default Dashboard;
