export type IncomeTypeValue = 'OFFERING' | 'TITHE' | 'SALE_OTHER';

export interface IncomeEntity {
  id: string;
  type: IncomeTypeValue;
  amount: string;
  date: Date;
  description: string | null;
  parishionerId: string | null;
  createdBy: string;
}
