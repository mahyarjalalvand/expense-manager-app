import { useEffect, useState } from "react";
import { Loader2, PlusCircleIcon } from "lucide-react";

import { toast } from "sonner";
import type { TransactionsFilterState } from "@/types/transactions";

import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import TransactionsFilter from "@/components/ui/TransactionsFilter";
import TransactionsPagination from "@/components/ui/TransactionsPagination";
import TransactionsTable from "@/components/ui/TransactionsTable";

import { useTransactions } from "@/hooks/useTransactions";

function Transactions() {
  const [open, setOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<TransactionsFilterState>("all");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const { data: transactions, isError, isLoading, isFetching, error } = useTransactions(page, limit, transactionFilter);

  const emptyMessage = transactionFilter === "all" ? "No transactions found" : `No ${transactionFilter} found`;

  const onSuccessDelete = () => {
    if (transactions?.data.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const changeFilterHandler = (filter: TransactionsFilterState) => {
    setTransactionFilter(filter);
    setPage(1);
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);
  return (
    <section>
      <div className="flex w-full items-center justify-between gap-3">
        <Button variant={"outline"} onClick={() => setOpen(true)} className="mb-4 flex items-center gap-2">
          Add Transaction
          <PlusCircleIcon />
        </Button>
        <TransactionsFilter filter={transactionFilter} setFilter={changeFilterHandler} />
      </div>
      <div className="bg-background overflow-hidden rounded-xl border">
        {isLoading ? (
          <div className="center h-60">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          transactions && (
            <>
              <TransactionsTable transactions={transactions.data} emptyMessage={emptyMessage} onDelete={onSuccessDelete} />
              <TransactionsPagination page={page} totalPages={transactions.pagination.totalPages ?? 0} setPage={setPage} isFetching={isFetching && !isLoading} />
            </>
          )
        )}
      </div>
      <CreateTransactionDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

export default Transactions;
