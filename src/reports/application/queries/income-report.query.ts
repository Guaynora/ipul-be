import { ReportFilter } from '../ports/reports-reader.port';

export class IncomeReportQuery {
  constructor(public readonly filter: ReportFilter) {}
}
