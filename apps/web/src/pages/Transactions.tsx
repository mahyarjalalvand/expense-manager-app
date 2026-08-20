import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import TransactionsTable from "@/components/ui/TransactionsTable";

import { useTransactions } from "@/hooks/useTransactions";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Transactions() {
  const [open, setOpen] = useState(false);
  const { data: transactions, isError, isLoading, error } = useTransactions();
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  return (
    <section>
      <Button variant={"outline"} onClick={() => setOpen(true)} className="mb-4 flex items-center gap-2">
        Add Transaction
        <PlusCircleIcon />
      </Button>
      <div className="bg-background overflow-hidden rounded-xl border">
        {isLoading ? (
          <div className="center h-60">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : transactions ? (
          <TransactionsTable transactions={transactions} />
        ) : (
          "Data not found!"
        )}
      </div>
      <CreateTransactionDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

export default Transactions;
