import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateExpenseHandler } from './application/commands/create-expense.handler';
import { EXPENSE_REPOSITORY } from './application/ports/expense.repository.port';
import { ListExpensesHandler } from './application/queries/list-expenses.handler';
import { PrismaExpenseRepository } from './infrastructure/prisma-expense.repository';
import { ExpensesResolver } from './presentation/expenses.resolver';

@Module({
  imports: [CqrsModule],
  providers: [
    ExpensesResolver,
    CreateExpenseHandler,
    ListExpensesHandler,
    PrismaExpenseRepository,
    {
      provide: EXPENSE_REPOSITORY,
      useExisting: PrismaExpenseRepository,
    },
  ],
})
export class ExpensesModule {}
