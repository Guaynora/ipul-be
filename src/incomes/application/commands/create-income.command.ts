import type { IncomeTypeValue } from '../../domain/income.entity';

export class CreateIncomeCommand {
  constructor(
    public readonly payload: {
      type: IncomeTypeValue;
      amount: string;
      date: Date;
      description?: string | null;
      parishionerId?: string | null;
      createdBy: string;
    },
  ) {}
}
