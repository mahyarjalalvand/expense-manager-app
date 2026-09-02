import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle } from "./card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { dateRanges } from "@/constant/dateRangeFilter";

type InconeExpenseChartProps = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

const formatAmount = (value: number) => {
  return value.toLocaleString("en-US");
};

function IncomeExpenseChart({ data }: InconeExpenseChartProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Income & Expenses</CardTitle>
        <Select items={dateRanges}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Date renges</SelectLabel>
              {dateRanges.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <ResponsiveContainer width="100%" height={350} minWidth={0}>
        <LineChart data={data}>
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              return new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis width="auto" />
          <Tooltip
            formatter={(value, name) => [formatAmount(Number(value)), name === "income" ? "Income" : "Expense"]}
            allowEscapeViewBox={{
              x: false,
              y: false,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="income" />
          <Line type="monotone" dataKey="expense" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default IncomeExpenseChart;
