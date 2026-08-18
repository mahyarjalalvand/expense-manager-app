import { getAllTransactions } from "@/api/transactions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

function Transactions() {
  const { data: transactions, isError, isLoading } = useQuery({ queryKey: ["transactions"], queryFn: getAllTransactions });
  console.log(transactions);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Transactions;
