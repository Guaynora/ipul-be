import type {
  ExpenseEntity,
  FundSourceValue,
} from '../../domain/expense.entity';

export const EXPENSE_REPOSITORY = 'EXPENSE_REPOSITORY';

export interface ExpenseRepositoryPort {
  create(payload: {
    description: string;
    amount: string;
    date: Date;
    category: string;
    fundSource: FundSourceValue;
    createdBy: string;
  }): Promise<ExpenseEntity>;
  findMany(): Promise<ExpenseEntity[]>;
}
