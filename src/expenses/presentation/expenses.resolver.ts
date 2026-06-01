import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateExpenseCommand } from '../application/commands/create-expense.command';
import { ListExpensesQuery } from '../application/queries/list-expenses.query';
import { CreateExpenseInput } from './dto/expense.input';
import { ExpenseTypeModel } from './expense.type';

@Resolver(() => ExpenseTypeModel)
@UseGuards(JwtAuthGuard, new RolesGuard(['ADMIN']))
export class ExpensesResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => ExpenseTypeModel)
  createExpense(
    @Args('input') input: CreateExpenseInput,
    @Args('createdBy') createdBy: string,
  ) {
    return this.commandBus.execute(
      new CreateExpenseCommand({
        ...input,
        date: new Date(input.date),
        createdBy,
      }),
    );
  }

  @Query(() => [ExpenseTypeModel])
  expenses() {
    return this.queryBus.execute(new ListExpensesQuery());
  }
}
