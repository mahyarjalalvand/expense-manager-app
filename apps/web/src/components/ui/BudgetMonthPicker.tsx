import { Input } from "./input";
import { Label } from "./label";

type BudgetMonthPickerProps = {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
};

function BudgetMonthPicker({ year, month, onChange }: BudgetMonthPickerProps) {
  const value = `${year}-${String(month).padStart(2, "0")}`;

  const handleChange = (value: string) => {
    if (!value) return;

    const [nextYear, nextMonth] = value.split("-").map(Number);

    if (nextYear && nextMonth >= 1 && nextMonth <= 12) {
      onChange(nextYear, nextMonth);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Budget month</Label>
      <Input id="budget-month" type="month" value={value} onChange={(e) => handleChange(e.target.value)} className="w-auto" />
    </div>
  );
}

export default BudgetMonthPicker;
