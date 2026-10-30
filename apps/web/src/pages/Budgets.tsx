import BudgetForm from "@/components/BudgetForm";
import BudgetMonthPicker from "@/components/ui/BudgetMonthPicker";
import BudgetSummary from "@/components/ui/BudgetSummary";
import { useGetBudget } from "@/hooks/useBudget";
import { useState } from "react";

function Budgets() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const { data, isPending, isError } = useGetBudget(selectedYear, selectedMonth);
  return (
    <div className="space-y-6">
      {isPending && <p className="text-sm text-muted-foreground">Loading budget...</p>}

      {!isPending && !isError && data === null && (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold">No budget defined</h2>

          <p className="mt-2 text-sm text-muted-foreground">Create a budget to start tracking your monthly expenses.</p>

          <div className="mt-6 text-left">
            <BudgetForm year={selectedYear} month={selectedMonth} isEditing={false} />
          </div>
        </div>
      )}

      {!isPending && !isError && data != null && (
        <>
          <BudgetSummary budget={data} setIsEditing={setIsEditing} />

          {isEditing && <BudgetForm year={selectedYear} month={selectedMonth} isEditing={isEditing} setIsEditing={setIsEditing} budget={data} />}
        </>
      )}
    </div>
  );
}

export default Budgets;
