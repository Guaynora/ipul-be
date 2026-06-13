export const REPORTS_READER = 'REPORTS_READER';

export interface IncomeByTypeRow {
  type: 'OFFERING' | 'TITHE' | 'SALE_OTHER';
  total: string;
}

export interface ExpenseByFundRow {
  fundSource: 'TITHE' | 'NON_TITHE';
  total: string;
}

export interface ExpenseByCategoryRow {
  category: string;
  total: string;
}

export interface ReportFilter {
  from?: Date;
  to?: Date;
}

export interface ReportsReaderPort {
  incomeByType(filter: ReportFilter): Promise<IncomeByTypeRow[]>;
  expenseByFund(filter: ReportFilter): Promise<ExpenseByFundRow[]>;
  expenseByCategory(filter: ReportFilter): Promise<ExpenseByCategoryRow[]>;
  totalIncome(filter: ReportFilter): Promise<string>;
  totalExpense(filter: ReportFilter): Promise<string>;
}
