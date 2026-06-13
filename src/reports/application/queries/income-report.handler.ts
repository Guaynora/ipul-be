import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPORTS_READER, type ReportsReaderPort } from '../ports/reports-reader.port';
import { IncomeReportQuery } from './income-report.query';

@Injectable()
@QueryHandler(IncomeReportQuery)
export class IncomeReportHandler implements IQueryHandler<IncomeReportQuery> {
  constructor(
    @Inject(REPORTS_READER) private readonly reader: ReportsReaderPort,
  ) {}

  async execute(query: IncomeReportQuery) {
    const [byType, grandTotal] = await Promise.all([
      this.reader.incomeByType(query.filter),
      this.reader.totalIncome(query.filter),
    ]);
    return { byType, grandTotal };
  }
}
