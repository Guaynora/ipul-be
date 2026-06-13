import { BalanceReportHandler } from '../balance-report.handler';
import { BalanceReportQuery } from '../balance-report.query';

describe('BalanceReportHandler', () => {
  it('calculates fund nets and netBalance correctly', async () => {
    const reader = {
      incomeByType: jest.fn().mockResolvedValue([
        { type: 'TITHE', total: '1000.00' },
        { type: 'OFFERING', total: '400.00' },
        { type: 'SALE_OTHER', total: '100.00' },
      ]),
      expenseByFund: jest.fn().mockResolvedValue([
        { fundSource: 'TITHE', total: '300.00' },
        { fundSource: 'NON_TITHE', total: '200.00' },
      ]),
      expenseByCategory: jest.fn(),
      totalIncome: jest.fn().mockResolvedValue('1500.00'),
      totalExpense: jest.fn().mockResolvedValue('500.00'),
    };
    const handler = new BalanceReportHandler(reader);

    const result = await handler.execute(new BalanceReportQuery({}));

    expect(result.byFund).toHaveLength(2);

    const tithe = result.byFund.find((f) => f.fund === 'TITHE')!;
    expect(tithe.totalIncome).toBe('1000');
    expect(tithe.totalExpense).toBe('300');
    expect(tithe.net).toBe('700');

    const nonTithe = result.byFund.find((f) => f.fund === 'NON_TITHE')!;
    expect(nonTithe.totalIncome).toBe('500');
    expect(nonTithe.totalExpense).toBe('200');
    expect(nonTithe.net).toBe('300');

    expect(result.totalIncome).toBe('1500.00');
    expect(result.totalExpense).toBe('500.00');
    expect(result.netBalance).toBe('1000');
  });

  it('handles a fund with no movements (total 0)', async () => {
    const reader = {
      incomeByType: jest.fn().mockResolvedValue([
        { type: 'TITHE', total: '500.00' },
        // no OFFERING or SALE_OTHER rows
      ]),
      expenseByFund: jest.fn().mockResolvedValue([
        { fundSource: 'TITHE', total: '100.00' },
        // no NON_TITHE row
      ]),
      expenseByCategory: jest.fn(),
      totalIncome: jest.fn().mockResolvedValue('500.00'),
      totalExpense: jest.fn().mockResolvedValue('100.00'),
    };
    const handler = new BalanceReportHandler(reader);

    const result = await handler.execute(new BalanceReportQuery({}));

    const nonTithe = result.byFund.find((f) => f.fund === 'NON_TITHE')!;
    expect(nonTithe.totalIncome).toBe('0');
    expect(nonTithe.totalExpense).toBe('0');
    expect(nonTithe.net).toBe('0');

    expect(result.netBalance).toBe('400');
  });
});
