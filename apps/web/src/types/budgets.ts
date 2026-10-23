export type Budget = {
  id: string;
  userId: string;
  name: string;
  amount: number;
  year: number;
  month: number;
  createAt: string;
  updatedAt: string;
};
export type MonthlyBudget = Budget & {
  spent: number;
  remaining: number;
  percentageUsed: number;
};

export type CreateBudget = {
  name: string;
  amount: number;
  year: number;
  month: number;
  confirmIncomeMismatch?: boolean;
};
export type UpdateBudget = {
  name?: string;
  amount?: number;
  confirmIncomeMismatch?: boolean;
};
