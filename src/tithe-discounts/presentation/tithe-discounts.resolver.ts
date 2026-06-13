import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateTitheDiscountCommand } from '../application/commands/create-tithe-discount.command';
import { ActivateTitheDiscountCommand } from '../application/commands/activate-tithe-discount.command';
import { ListTitheDiscountsQuery } from '../application/queries/list-tithe-discounts.query';
import { GetActiveTitheDiscountQuery } from '../application/queries/get-active-tithe-discount.query';
import { CreateTitheDiscountInput } from './dto/tithe-discount.input';
import { TitheDiscountTypeModel } from './tithe-discount.type';
import { TitheDiscountEntity } from '../domain/tithe-discount.entity';

function toTypeModel(entity: TitheDiscountEntity): TitheDiscountTypeModel {
  return {
    ...entity,
    rules: JSON.stringify(entity.rules),
  } as TitheDiscountTypeModel;
}

@Resolver(() => TitheDiscountTypeModel)
@UseGuards(JwtAuthGuard, new RolesGuard(['ADMIN']))
export class TitheDiscountsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => TitheDiscountTypeModel)
  async createTitheDiscount(
    @Args('input') input: CreateTitheDiscountInput,
    @Args('createdBy') createdBy: string,
  ) {
    const entity = await this.commandBus.execute<
      CreateTitheDiscountCommand,
      TitheDiscountEntity
    >(
      new CreateTitheDiscountCommand({
        effectiveFrom: new Date(input.effectiveFrom),
        rules: input.rules,
        createdBy,
      }),
    );
    return toTypeModel(entity);
  }

  @Mutation(() => TitheDiscountTypeModel)
  async activateTitheDiscount(@Args('id') id: string) {
    const entity = await this.commandBus.execute<
      ActivateTitheDiscountCommand,
      TitheDiscountEntity
    >(new ActivateTitheDiscountCommand(id));
    return toTypeModel(entity);
  }

  @Query(() => [TitheDiscountTypeModel])
  async titheDiscounts() {
    const entities = await this.queryBus.execute<
      ListTitheDiscountsQuery,
      TitheDiscountEntity[]
    >(new ListTitheDiscountsQuery());
    return entities.map(toTypeModel);
  }

  @Query(() => TitheDiscountTypeModel, { nullable: true })
  async activeTitheDiscount() {
    const entity = await this.queryBus.execute<
      GetActiveTitheDiscountQuery,
      TitheDiscountEntity | null
    >(new GetActiveTitheDiscountQuery());
    return entity ? toTypeModel(entity) : null;
  }
}
