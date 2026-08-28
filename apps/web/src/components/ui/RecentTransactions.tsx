import type { Transactions } from "@/types/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type RecentTransactionsProps = {
  data: Transactions[];
};

function RecentTransactions({ data }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <p>
                {item.type === "income" ? "+" : "-"}
                {item.amount.toLocaleString("en-US")}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentTransactions;
