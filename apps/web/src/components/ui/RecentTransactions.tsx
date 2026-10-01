import { Card, CardContent, CardHeader, CardTitle } from "./card";
import type { DashboardData } from "@/types/dashboard";

type RecentTransactionsProps = {
  data: DashboardData["recentTransactions"];
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
                <p className="text-sm text-muted-foreground">{item.categoryName}</p>
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
