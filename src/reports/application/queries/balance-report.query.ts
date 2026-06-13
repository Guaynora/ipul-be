import { ReportFilter } from '../ports/reports-reader.port';

export class BalanceReportQuery {
  constructor(public readonly filter: ReportFilter) {}
}
