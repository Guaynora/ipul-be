import { IncomeReportHandler } from '../income-report.handler';
import { IncomeReportQuery } from '../income-report.query';

describe('IncomeReportHandler', () => {
  it('returns byType rows and grandTotal correctly (happy path)', async () => {
    const byTypeRows = [
      { type: 'TITHE' as const, total: '500.00' },
      { type: 'OFFERING' as const, total: '200.00' },
    ];
    const reader = {
      incomeByType: jest.fn().mockResolvedValue(byTypeRows),
      expenseByFund: jest.fn(),
      expenseByCategory: jest.fn(),
      totalIncome: jest.fn().mockResolvedValue('700.00'),
      totalExpense: jest.fn(),
    };
    const handler = new IncomeReportHandler(reader);

    const result = await handler.execute(new IncomeReportQuery({}));

    expect(result).toEqual({ byType: byTypeRows, grandTotal: '700.00' });
    expect(reader.incomeByType).toHaveBeenCalledWith({});
    expect(reader.totalIncome).toHaveBeenCalledWith({});
  });

  it('returns zero totals when reader returns empty arrays', async () => {
    const reader = {
      incomeByType: jest.fn().mockResolvedValue([]),
      expenseByFund: jest.fn(),
      expenseByCategory: jest.fn(),
      totalIncome: jest.fn().mockResolvedValue('0'),
      totalExpense: jest.fn(),
    };
    const handler = new IncomeReportHandler(reader);

    const result = await handler.execute(new IncomeReportQuery({}));

    expect(result).toEqual({ byType: [], grandTotal: '0' });
  });
});
