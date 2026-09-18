import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { createTransactionSchema, type CreateTransactionForm } from "@/schemas/transaction.schema";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useCreateTransactions } from "@/hooks/useCreateTransactions";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCategories } from "@/hooks/useCategories";

type CreateTransactionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateTransactionDialog({ open, onOpenChange }: CreateTransactionProps) {
  const createTransaction = useCreateTransactions();

  const { data: categories = [], isPending } = useCategories();

  const form = useForm<CreateTransactionForm>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      categoryId: "",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="500000"
                  aria-invalid={fieldState.invalid}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className="no-scrollbar"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="select category">{categories.find((item) => item.id === field.value)?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {isPending ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No categories found
                      </SelectItem>
                    ) : (
                      categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select transactions type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="destructive" onClick={() => onOpenChange(false)}>
              Cancel
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
