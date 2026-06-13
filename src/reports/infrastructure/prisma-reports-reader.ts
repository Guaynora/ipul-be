import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ExpenseByCategoryRow,
  ExpenseByFundRow,
  IncomeByTypeRow,
  ReportFilter,
  ReportsReaderPort,
} from '../application/ports/reports-reader.port';

@Injectable()
export class PrismaReportsReader implements ReportsReaderPort {
  constructor(private readonly prisma: PrismaService) {}

  async incomeByType(filter: ReportFilter): Promise<IncomeByTypeRow[]> {
    const rows = await this.prisma.income.groupBy({
      by: ['type'],
      _sum: { amount: true },
      where: this.incomeWhere(filter),
      orderBy: { type: 'asc' },
    });
    return rows.map((r) => ({
      type: r.type as 'OFFERING' | 'TITHE' | 'SALE_OTHER',
      total: (r._sum.amount ?? new Prisma.Decimal(0)).toString(),
    }));
  }

  async expenseByFund(filter: ReportFilter): Promise<ExpenseByFundRow[]> {
    const rows = await this.prisma.expense.groupBy({
      by: ['fundSource'],
      _sum: { amount: true },
      where: this.expenseWhere(filter),
      orderBy: { fundSource: 'asc' },
    });
    return rows.map((r) => ({
      fundSource: r.fundSource as 'TITHE' | 'NON_TITHE',
      total: (r._sum.amount ?? new Prisma.Decimal(0)).toString(),
    }));
  }

  async expenseByCategory(filter: ReportFilter): Promise<ExpenseByCategoryRow[]> {
    const rows = await this.prisma.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: this.expenseWhere(filter),
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => ({
      category: r.category,
      total: (r._sum.amount ?? new Prisma.Decimal(0)).toString(),
    }));
  }

  async totalIncome(filter: ReportFilter): Promise<string> {
    const agg = await this.prisma.income.aggregate({
      _sum: { amount: true },
      where: this.incomeWhere(filter),
    });
    return (agg._sum.amount ?? new Prisma.Decimal(0)).toString();
  }

  async totalExpense(filter: ReportFilter): Promise<string> {
    const agg = await this.prisma.expense.aggregate({
      _sum: { amount: true },
      where: this.expenseWhere(filter),
    });
    return (agg._sum.amount ?? new Prisma.Decimal(0)).toString();
  }

  private incomeWhere(filter: ReportFilter) {
    return filter.from || filter.to
      ? {
          date: {
            ...(filter.from && { gte: filter.from }),
            ...(filter.to && { lte: filter.to }),
          },
        }
      : {};
  }

  private expenseWhere(filter: ReportFilter) {
    return filter.from || filter.to
      ? {
          date: {
            ...(filter.from && { gte: filter.from }),
            ...(filter.to && { lte: filter.to }),
          },
        }
      : {};
  }
}
