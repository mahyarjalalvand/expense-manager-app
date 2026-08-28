import { Card, CardContent, CardHeader, CardTitle } from "./card";

type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
};

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
