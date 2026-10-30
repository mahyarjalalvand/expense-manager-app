import { useState } from "react";
import { budgetFormSchema, type BudgetFormValues } from "@/schemas/budget";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useCreateBudget, useUpdateBudget } from "@/hooks/useBudget";
import type { BudgetApiError, MonthlyBudget } from "@/types/budgets";
import BudgetIncomeConfirmDialog from "./ui/BudgetIncomeConfirmDialog";
import BudgetFormFields from "./ui/BudgetFormFields";

type BudgetFormProps = {
  setIsEditing?: (value: boolean) => void;
  year: number;
  month: number;
  isEditing: boolean;
  budget?: MonthlyBudget;
};

function BudgetForm({ year, month, isEditing, setIsEditing, budget }: BudgetFormProps) {
  const [pendingValues, setPendingValues] = useState<BudgetFormValues | null>(null);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: budget?.name ?? "",
      amount: budget?.amount ?? 0,
    },
  });

  const createBudget = useCreateBudget(year, month);
  const updateBudget = useUpdateBudget(year, month);

  const handleSuccess = () => {
    toast.success(isEditing ? "Budget updated successfully" : "Budget created successfully");

    form.reset();
    setPendingValues(null);
    setIsEditing?.(false);
  };

  const executeMutation = (values: BudgetFormValues, confirmed = false) => {
    const mutationValues = {
      ...values,
      ...(confirmed ? { confirmIncomeMismatch: true } : {}),
    };

    const options = {
      onSuccess: handleSuccess,

      onError: (error: Error) => {
        const apiError = error as BudgetApiError;

        if (apiError.code === "BUDGET_EXCEEDS_INCOME") {
          setPendingValues(values);
          return;
        }

        toast.error(apiError.message);
      },
    };

    if (isEditing) {
      updateBudget.mutate(mutationValues, options);
    } else {
      createBudget.mutate(mutationValues, options);
    }
  };

  const submitHandler = (data: BudgetFormValues) => {
    executeMutation(data);
  };

  const confirmBudget = () => {
    if (!pendingValues) return;

    executeMutation(pendingValues, true);
  };

  const isPending = createBudget.isPending || updateBudget.isPending;

  const handleCancelEditing = () => {
    form.reset({
      name: budget?.name ?? "",
      amount: budget?.amount ?? 0,
    });

    setIsEditing?.(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit budget" : "Create budget"}</CardTitle>
        </CardHeader>

        <CardContent>
          <BudgetFormFields form={form} submit={submitHandler} pending={isPending} isEditing={isEditing} onCancel={handleCancelEditing} />
        </CardContent>
      </Card>
      <BudgetIncomeConfirmDialog
        open={pendingValues !== null}
        isEditing={isEditing}
        isPending={isPending}
        onConfirm={confirmBudget}
        onCancel={() => setPendingValues(null)}
      />
    </>
  );
}

export default BudgetForm;
