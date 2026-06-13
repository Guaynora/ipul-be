import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPORTS_READER, type ReportsReaderPort } from '../ports/reports-reader.port';
import { ExpenseReportQuery } from './expense-report.query';

@Injectable()
@QueryHandler(ExpenseReportQuery)
export class ExpenseReportHandler implements IQueryHandler<ExpenseReportQuery> {
  constructor(
    @Inject(REPORTS_READER) private readonly reader: ReportsReaderPort,
  ) {}

  async execute(query: ExpenseReportQuery) {
    const [byFund, byCategory, grandTotal] = await Promise.all([
      this.reader.expenseByFund(query.filter),
      this.reader.expenseByCategory(query.filter),
      this.reader.totalExpense(query.filter),
    ]);
    return { byFund, byCategory, grandTotal };
  }
}
