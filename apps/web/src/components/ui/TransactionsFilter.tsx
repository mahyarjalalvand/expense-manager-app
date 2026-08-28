import type { Dispatch, SetStateAction } from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import type { TransactionsFilterState } from "@/types/transactions";
type TransactionsFilterProps = {
  filter: TransactionsFilterState;
  setFilter: Dispatch<SetStateAction<TransactionsFilterState>>;
};
function TransactionsFilter({ filter, setFilter }: TransactionsFilterProps) {
  return (
    <ToggleGroup
      variant="outline"
      value={[filter]}
      onValueChange={(value) => {
        const selectedFilter = value[0];

        if (selectedFilter) {
          setFilter(selectedFilter as TransactionsFilterState);
        }
      }}>
      <ToggleGroupItem value="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="expense" aria-label="Toggle expense">
        Expense
      </ToggleGroupItem>
      <ToggleGroupItem value="income" aria-label="Toggle income">
        Income
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default TransactionsFilter;
