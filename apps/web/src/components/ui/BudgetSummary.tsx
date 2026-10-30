import type { MonthlyBudget } from "@/types/budgets";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { useDeleteBudget } from "@/hooks/useBudget";
import { toast } from "sonner";
import { useState } from "react";

type BudgetSummaryProps = {
  budget: MonthlyBudget;
  setIsEditing: (value: boolean) => void;
};

const formatMoney = (amount: number) => new Intl.NumberFormat("en-US").format(amount);

function BudgetSummary({ budget, setIsEditing }: BudgetSummaryProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const progress = Math.min(100, Math.max(0, budget.percentageUsed));

  const deleteBudget = useDeleteBudget(budget.year, budget.month);

  const handleDelete = () => {
    deleteBudget.mutate(undefined, {
      onSuccess: () => {
        toast.success("Budget deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete budget");
      },
    });
  };

  const stats = [
    { label: "Monthly budget", amount: budget.amount },
    { label: "Total spent", amount: budget.spent },
    { label: "Remaining", amount: budget.remaining },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>{budget.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button" onClick={() => setIsEditing(true)}>
            Edit
          </Button>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              }></AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this budget?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your transactions will not be deleted, but this monthly budget will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    handleDelete();
                  }}>
                  {deleteBudget.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{formatMoney(stat.amount)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget used</span>
            <span className="font-medium">{budget.percentageUsed}%</span>
          </div>

          <Progress value={progress} />

          {budget.percentageUsed >= 100 && <p className="text-sm text-destructive">You have reached or exceeded your budget.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetSummary;
