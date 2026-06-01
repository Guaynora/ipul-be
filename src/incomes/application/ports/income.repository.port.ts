import { IncomeEntity } from '../../domain/income.entity';
import type { IncomeTypeValue } from '../../domain/income.entity';

export const INCOME_REPOSITORY = 'INCOME_REPOSITORY';

export interface IncomeRepositoryPort {
  create(payload: {
    type: IncomeTypeValue;
    amount: string;
    date: Date;
    description?: string | null;
    parishionerId?: string | null;
    createdBy: string;
  }): Promise<IncomeEntity>;
  findMany(): Promise<IncomeEntity[]>;
}
