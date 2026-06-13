import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BalanceReportHandler } from './application/queries/balance-report.handler';
import { ExpenseReportHandler } from './application/queries/expense-report.handler';
import { IncomeReportHandler } from './application/queries/income-report.handler';
import { REPORTS_READER } from './application/ports/reports-reader.port';
import { PrismaReportsReader } from './infrastructure/prisma-reports-reader';
import { ReportsResolver } from './presentation/reports.resolver';

@Module({
  imports: [CqrsModule],
  providers: [
    ReportsResolver,
    IncomeReportHandler,
    ExpenseReportHandler,
    BalanceReportHandler,
    PrismaReportsReader,
    { provide: REPORTS_READER, useExisting: PrismaReportsReader },
  ],
})
export class ReportsModule {}
