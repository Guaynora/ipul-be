import { ReportFilter } from '../ports/reports-reader.port';

export class ExpenseReportQuery {
  constructor(public readonly filter: ReportFilter) {}
}
