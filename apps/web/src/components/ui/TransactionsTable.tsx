import type { Transactions } from "@/types/transactions.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
function TransactionsTable({ transactions }: { transactions: Transactions[] }) {
  return (
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
  );
}

export default TransactionsTable;
