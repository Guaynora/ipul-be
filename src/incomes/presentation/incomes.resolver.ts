import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateIncomeCommand } from '../application/commands/create-income.command';
import { ListIncomesQuery } from '../application/queries/list-incomes.query';
import { CreateIncomeInput } from './dto/income.input';
import { IncomeTypeModel } from './income.type';

@Resolver(() => IncomeTypeModel)
@UseGuards(JwtAuthGuard, new RolesGuard(['ADMIN']))
export class IncomesResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => IncomeTypeModel)
  createIncome(
    @Args('input') input: CreateIncomeInput,
    @Args('createdBy') createdBy: string,
  ) {
    return this.commandBus.execute(
      new CreateIncomeCommand({
        ...input,
        date: new Date(input.date),
        createdBy,
      }),
    );
  }

  @Query(() => [IncomeTypeModel])
  incomes() {
    return this.queryBus.execute(new ListIncomesQuery());
  }
}
