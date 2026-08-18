import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateTransactions } from "@/hooks/useCreateTransactions";
import { useTransactions } from "@/hooks/useTransactions";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

function Transactions() {
  const { data: transactions, isError, isLoading, error } = useTransactions();
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const createTransactions = useCreateTransactions();
  const createHandler = () => {
    createTransactions.mutate({
      title: "ssdafas",
      amount: 340000,
      category: "housy",
      type: "income",
    });
  };
  return (
    <section>
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
    </section>
  );
}

export default Transactions;
