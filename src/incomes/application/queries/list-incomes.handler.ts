import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  INCOME_REPOSITORY,
  type IncomeRepositoryPort,
} from '../ports/income.repository.port';
import { ListIncomesQuery } from './list-incomes.query';

@Injectable()
@QueryHandler(ListIncomesQuery)
export class ListIncomesHandler implements IQueryHandler<ListIncomesQuery> {
  constructor(
    @Inject(INCOME_REPOSITORY)
    private readonly incomeRepository: IncomeRepositoryPort,
  ) {}

  execute() {
    return this.incomeRepository.findMany();
  }
}
