import { Input } from "./input";
import { Label } from "./label";

type BudgetMonthPickerProps = {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
};

function BudgetMonthPicker({ year, month, onChange }: BudgetMonthPickerProps) {
  const value = `${year}-${String(month).padStart(2, "0")}`;
  return (
    <div className="space-y-2">
      <Label>Budget month</Label>
      <Input
        id="budget-month"
        type="month"
        value={value}
        onChange={(e) => {
          const [nextYear, nextMonth] = e.target.value.split("-").map(Number);
          if (nextMonth && nextMonth) {
            onChange(nextYear, nextMonth);
          }
        }}
        className="w-auto"
      />
    </div>
  );
}

export default BudgetMonthPicker;
