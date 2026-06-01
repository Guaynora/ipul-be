export type FundSourceValue = 'TITHE' | 'NON_TITHE';

export interface ExpenseEntity {
  id: string;
  description: string;
  amount: string;
  date: Date;
  category: string;
  fundSource: FundSourceValue;
  createdBy: string;
}
