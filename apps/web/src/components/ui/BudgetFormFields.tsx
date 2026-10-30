import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./field";
import { Input } from "./input";
import { Button } from "./button";
import type { BudgetFormValues } from "@/schemas/budget";
type BudgetFormFieldsProps = {
  form: UseFormReturn<BudgetFormValues>;
  submit: (values: BudgetFormValues) => void;
  pending: boolean;
  isEditing: boolean;
  onCancel: () => void;
};

function BudgetFormFields({ form, submit, pending, isEditing, onCancel }: BudgetFormFieldsProps) {
  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
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
          <Button type="button" variant="destructive" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : isEditing ? "Update budget" : "Create budget"}
        </Button>
      </div>
    </form>
  );
}

export default BudgetFormFields;
