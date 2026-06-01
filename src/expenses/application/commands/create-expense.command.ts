import type { FundSourceValue } from '../../domain/expense.entity';

export class CreateExpenseCommand {
  constructor(
    public readonly payload: {
      description: string;
      amount: string;
      date: Date;
      category: string;
      fundSource: FundSourceValue;
      createdBy: string;
    },
  ) {}
}
