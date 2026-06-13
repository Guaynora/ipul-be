import { ExpenseReportHandler } from '../expense-report.handler';
import { ExpenseReportQuery } from '../expense-report.query';

describe('ExpenseReportHandler', () => {
  it('returns byFund, byCategory and grandTotal correctly (happy path)', async () => {
    const byFundRows = [
      { fundSource: 'TITHE' as const, total: '300.00' },
      { fundSource: 'NON_TITHE' as const, total: '150.00' },
    ];
    const byCategoryRows = [
      { category: 'Servicios', total: '200.00' },
      { category: 'Oficina', total: '250.00' },
    ];
    const reader = {
      incomeByType: jest.fn(),
      expenseByFund: jest.fn().mockResolvedValue(byFundRows),
      expenseByCategory: jest.fn().mockResolvedValue(byCategoryRows),
      totalIncome: jest.fn(),
      totalExpense: jest.fn().mockResolvedValue('450.00'),
    };
    const handler = new ExpenseReportHandler(reader);

    const result = await handler.execute(new ExpenseReportQuery({}));

    expect(result).toEqual({
      byFund: byFundRows,
      byCategory: byCategoryRows,
      grandTotal: '450.00',
    });
    expect(reader.expenseByFund).toHaveBeenCalledWith({});
    expect(reader.expenseByCategory).toHaveBeenCalledWith({});
    expect(reader.totalExpense).toHaveBeenCalledWith({});
  });

  it('handles empty arrays', async () => {
    const reader = {
      incomeByType: jest.fn(),
      expenseByFund: jest.fn().mockResolvedValue([]),
      expenseByCategory: jest.fn().mockResolvedValue([]),
      totalIncome: jest.fn(),
      totalExpense: jest.fn().mockResolvedValue('0'),
    };
    const handler = new ExpenseReportHandler(reader);

    const result = await handler.execute(new ExpenseReportQuery({}));

    expect(result).toEqual({ byFund: [], byCategory: [], grandTotal: '0' });
  });
});
