import { useState } from "react";
import { budgetFormSchema, type BudgetFormValues } from "@/schemas/budget";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import { useCreateBudget } from "@/hooks/useBudget";
import type { MonthlyBudget } from "@/types/budgets";

type BudgetApiError = Error & {
  code?: string;
  budgetAmount?: number;
  monthlyIncome?: number;
};

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
      name: budget.name ?? "",
      amount: budget.amount ?? 0,
    },
  });

  const createBudget = useCreateBudget(year, month);

  const submitHandler = (data: BudgetFormValues) => {
    createBudget.mutate(data, {
      onSuccess: () => {
        toast.success("Budget created successfully");
        form.reset();
        // setPendingValues(null);
        setIsEditing?.(false);
      },
      onError: (error) => {
        const apiError = error as BudgetApiError;

        if (apiError.code === "BUDGET_EXCEEDS_INCOME") {
          setPendingValues(data);
          return;
        }

        toast.error(apiError.message);
      },
    });
  };

  const confirmBudget = () => {
    if (!pendingValues) return;

    createBudget.mutate(
      {
        ...pendingValues,
        confirmIncomeMismatch: true,
      },
      {
        onSuccess: () => {
          toast.success("Budget created successfully");
          form.reset();
          setPendingValues(null);
          setIsEditing?.(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-5">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name-input">Budget name:</FieldLabel>

                  <Input {...field} id="name-input" aria-invalid={fieldState.invalid} placeholder="Please enter your budget name" autoComplete="off" />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="amount-input">Budget amount:</FieldLabel>

                  <Input
                    {...field}
                    value={field.value}
                    id="amount-input"
                    aria-invalid={fieldState.invalid}
                    type="number"
                    placeholder="Please enter the budget amount"
                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    autoComplete="off"
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex gap-3">
              {isEditing && (
                <Button type="button" variant="destructive" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}

              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog
        open={pendingValues !== null}
        onOpenChange={(open) => {
          if (!open) setPendingValues(null);
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Budget exceeds your income</AlertDialogTitle>

            <AlertDialogDescription>
              The budget amount is higher than your recorded income for this month. Do you want to create the budget anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingValues(null)}>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={confirmBudget}>Create anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default BudgetForm;
