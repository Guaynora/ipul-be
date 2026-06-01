import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepositoryPort,
} from '../ports/expense.repository.port';
import { ListExpensesQuery } from './list-expenses.query';

@Injectable()
@QueryHandler(ListExpensesQuery)
export class ListExpensesHandler implements IQueryHandler<ListExpensesQuery> {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: ExpenseRepositoryPort,
  ) {}

  execute() {
    return this.expenseRepository.findMany();
  }
}
