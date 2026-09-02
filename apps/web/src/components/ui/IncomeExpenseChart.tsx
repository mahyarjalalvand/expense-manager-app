import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle } from "./card";

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
      <CardHeader>
        <CardTitle>Income & Expenses</CardTitle>
        <p></p>
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
          <YAxis />
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
