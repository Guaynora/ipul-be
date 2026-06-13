import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ReportFilter } from '../application/ports/reports-reader.port';
import { BalanceReportQuery } from '../application/queries/balance-report.query';
import { ExpenseReportQuery } from '../application/queries/expense-report.query';
import { IncomeReportQuery } from '../application/queries/income-report.query';
import { ReportFilterInput } from './dto/report-filter.input';
import {
  BalanceReportModel,
  ExpenseReportModel,
  IncomeReportModel,
} from './report.types';

@Resolver()
@UseGuards(JwtAuthGuard, new RolesGuard(['ADMIN']))
export class ReportsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => IncomeReportModel)
  incomeReport(
    @Args('filter', { nullable: true }) filter?: ReportFilterInput,
  ) {
    return this.queryBus.execute(
      new IncomeReportQuery(this.toFilter(filter)),
    );
  }

  @Query(() => ExpenseReportModel)
  expenseReport(
    @Args('filter', { nullable: true }) filter?: ReportFilterInput,
  ) {
    return this.queryBus.execute(
      new ExpenseReportQuery(this.toFilter(filter)),
    );
  }

  @Query(() => BalanceReportModel)
  balanceReport(
    @Args('filter', { nullable: true }) filter?: ReportFilterInput,
  ) {
    return this.queryBus.execute(
      new BalanceReportQuery(this.toFilter(filter)),
    );
  }

  private toFilter(input?: ReportFilterInput): ReportFilter {
    return {
      from: input?.from ? new Date(input.from) : undefined,
      to: input?.to ? new Date(input.to) : undefined,
    };
  }
}
