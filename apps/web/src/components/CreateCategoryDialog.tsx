import { createCategorySchema, type CreateCategory } from "@/schemas/categories.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { categoryIcons } from "@/constant/categoryIcons";
import { Check } from "lucide-react";
import { categoryColors } from "@/constant/categoryColors";
import { cn } from "@/lib/utils";
type CreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateCategoryDialog({ open, onOpenChange }: CreateDialogProps) {
  const form = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      color: "",
    },
  });
  const submitHandler = (data: CreateCategory) => {
    console.log(data);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-5">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input {...field} id={field.name} placeholder="Enter your category" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="icon"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Icon</FieldLabel>
                {/* <Input {...field} id={field.name} placeholder="Icon name" aria-invalid={fieldState.invalid} /> */}
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(categoryIcons).map(([name, Icon]) => {
                    const selected = field.value === name;

                    return (
                      <Button key={name} type="button" variant={selected ? "secondary" : "outline"} className="relative size-10 p-0" onClick={() => field.onChange(name)}>
                        <Icon className="size-5" />

                        {selected && (
                          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
                {fieldState && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="color"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Color</FieldLabel>

                {/* <Input {...field} id={field.name} placeholder="#22c55e" aria-invalid={fieldState.invalid} /> */}
                <div className="flex flex-wrap gap-2">
                  {categoryColors.map((color) => {
                    const selected = field.value === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-105",
                          selected ? "border-foreground" : "border-transparent",
                        )}
                        aria-label={`select color ${color}`}
                        style={{ backgroundColor: color }}>
                        {selected && <Check className="size-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryDialog;
