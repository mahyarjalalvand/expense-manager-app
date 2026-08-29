import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
};

const variantStyles = {
  income: {
    icon: "text-emerald-600 bg-emerald-100",
  },
  expense: {
    icon: "text-red-600 bg-red-100",
  },
  balance: {
    icon: "text-blue-600 bg-blue-100",
  },
};

function SummaryCard({ title, value, description, icon: Icon, variant }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between ">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`center size-9 rounded-lg ${variantStyles[variant].icon}`}>
            <Icon className="size-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-2xl font-bold">{value.toLocaleString("en-US")}</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
