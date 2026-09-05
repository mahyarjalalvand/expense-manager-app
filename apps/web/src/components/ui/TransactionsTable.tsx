import type { Transactions } from "@/types/transactions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { MoreHorizontal, Trash } from "lucide-react";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
function TransactionsTable({ transactions, emptyMessage }: { transactions: Transactions[]; emptyMessage: string }) {
  const [transactionToDelete, setTransactionToDelete] = useState<Transactions | null>(null);

  const deleteTransaction = useDeleteTransaction();

  const deleteHandler = (id: string) => {
    deleteTransaction.mutate(id, {
      onSuccess: () => {
        toast.success("delete successfully");
      },

      onError: (err) => {
        toast.error(err.message);
      },
    });
  };
  return (
    <>
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
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h32 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            transactions?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" />}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem variant="destructive" onClick={() => setTransactionToDelete(item)}>
                        <Trash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <AlertDialog
        open={!!transactionToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setTransactionToDelete(null);
          }
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>{`Are you sure you want to delete '${transactionToDelete?.title}'`}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!transactionToDelete) return;
                deleteHandler(transactionToDelete?.id);
                setTransactionToDelete(null);
              }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TransactionsTable;
