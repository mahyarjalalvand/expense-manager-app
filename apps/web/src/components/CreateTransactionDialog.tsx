import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { createTransactionSchema, type CreateTransactionForm } from "@/schemas/transaction.schema";

type CreateTransactionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateTransactionDialog({ open, onOpenChange }: CreateTransactionProps) {
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
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <button type="submit">Create</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;
