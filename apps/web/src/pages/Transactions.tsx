import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <CreateTransactionDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

export default Transactions;
