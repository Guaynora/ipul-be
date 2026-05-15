import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateParishionerCommand } from '../application/commands/create-parishioner.command';
import { DeleteParishionerCommand } from '../application/commands/delete-parishioner.command';
import { UpdateParishionerCommand } from '../application/commands/update-parishioner.command';
import { GetParishionerQuery } from '../application/queries/get-parishioner.query';
import { ListParishionersQuery } from '../application/queries/list-parishioners.query';
import {
  CreateParishionerInput,
  UpdateParishionerInput,
} from './dto/parishioner.input';
import { ParishionerType } from './parishioner.type';

@Resolver(() => ParishionerType)
@UseGuards(JwtAuthGuard, new RolesGuard(['ADMIN']))
export class ParishionersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => ParishionerType)
  createParishioner(@Args('input') input: CreateParishionerInput) {
    return this.commandBus.execute(new CreateParishionerCommand(input));
  }

  @Query(() => [ParishionerType])
  parishioners() {
    return this.queryBus.execute(new ListParishionersQuery());
  }

  @Query(() => ParishionerType, { nullable: true })
  parishioner(@Args('id', { type: () => ID }) id: string) {
    return this.queryBus.execute(new GetParishionerQuery(id));
  }

  @Mutation(() => ParishionerType)
  updateParishioner(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateParishionerInput,
  ) {
    return this.commandBus.execute(new UpdateParishionerCommand(id, input));
  }

  @Mutation(() => Boolean)
  deleteParishioner(@Args('id', { type: () => ID }) id: string) {
    return this.commandBus.execute(new DeleteParishionerCommand(id));
  }
}
