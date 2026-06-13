import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { REPORTS_READER, type ReportsReaderPort } from '../ports/reports-reader.port';
import { BalanceReportQuery } from './balance-report.query';

@Injectable()
@QueryHandler(BalanceReportQuery)
export class BalanceReportHandler implements IQueryHandler<BalanceReportQuery> {
  constructor(
    @Inject(REPORTS_READER) private readonly reader: ReportsReaderPort,
  ) {}

  async execute(query: BalanceReportQuery) {
    const [incomeRows, expenseRows, totalIncome, totalExpense] =
      await Promise.all([
        this.reader.incomeByType(query.filter),
        this.reader.expenseByFund(query.filter),
        this.reader.totalIncome(query.filter),
        this.reader.totalExpense(query.filter),
      ]);

    const titheIncome = new Prisma.Decimal(
      incomeRows.find((r) => r.type === 'TITHE')?.total ?? '0',
    );
    const nonTitheIncome = incomeRows
      .filter((r) => r.type === 'OFFERING' || r.type === 'SALE_OTHER')
      .reduce(
        (acc, r) => acc.plus(new Prisma.Decimal(r.total)),
        new Prisma.Decimal('0'),
      );

    const titheExpense = new Prisma.Decimal(
      expenseRows.find((r) => r.fundSource === 'TITHE')?.total ?? '0',
    );
    const nonTitheExpense = new Prisma.Decimal(
      expenseRows.find((r) => r.fundSource === 'NON_TITHE')?.total ?? '0',
    );

    const netBalance = new Prisma.Decimal(totalIncome)
      .minus(totalExpense)
      .toString();

    return {
      byFund: [
        {
          fund: 'TITHE',
          totalIncome: titheIncome.toString(),
          totalExpense: titheExpense.toString(),
          net: titheIncome.minus(titheExpense).toString(),
        },
        {
          fund: 'NON_TITHE',
          totalIncome: nonTitheIncome.toString(),
          totalExpense: nonTitheExpense.toString(),
          net: nonTitheIncome.minus(nonTitheExpense).toString(),
        },
      ],
      totalIncome,
      totalExpense,
      netBalance,
    };
  }
}
