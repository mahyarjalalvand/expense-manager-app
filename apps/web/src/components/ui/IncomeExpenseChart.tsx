import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type InconeExpenseChartProps = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

function IncomeExpenseChart({ data }: InconeExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350} minWidth={0}>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" />
        <Line type="monotone" dataKey="expense" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default IncomeExpenseChart;
