import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { createTransactionSchema, type CreateTransactionForm } from "@/schemas/transaction.schema";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useCreateTransactions } from "@/hooks/useCreateTransactions";
import { toast } from "sonner";
import { Button } from "./ui/button";

type CreateTransactionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateTransactionDialog({ open, onOpenChange }: CreateTransactionProps) {
  const createTransaction = useCreateTransactions();
  const form = useForm<CreateTransactionForm>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      type: "expense",
    },
  });
  const onSubmit = (data: CreateTransactionForm) => {
    createTransaction.mutate(data, {
      onSuccess: () => {
        toast.success("Transaction created successfully");
        onOpenChange(false);
        form.reset();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input {...field} id={field.name} placeholder="e.g. Grocery shopping" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  placeholder="e.g. 500000"
                  aria-invalid={fieldState.invalid}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Input {...field} id={field.name} placeholder="e.g. food" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                {/* <select {...field} id={field.name} aria-invalid={fieldState.invalid} className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                  <option value="expense">Expense</option>

                  <option value="income">Income</option>
                </select> */}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={() => onOpenChange(false)}>
              Cancle
            </Button>

            <Button type="submit" disabled={createTransaction.isPending}>
              {createTransaction.isPending ? "Creating ..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;
