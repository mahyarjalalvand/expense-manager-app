import { Card, CardContent, CardHeader, CardTitle } from "./card";

type SummaryCardProps = {
  title: string;
  value: number;
};

function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
