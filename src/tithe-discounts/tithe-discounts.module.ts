import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTitheDiscountHandler } from './application/commands/create-tithe-discount.handler';
import { ActivateTitheDiscountHandler } from './application/commands/activate-tithe-discount.handler';
import { ListTitheDiscountsHandler } from './application/queries/list-tithe-discounts.handler';
import { GetActiveTitheDiscountHandler } from './application/queries/get-active-tithe-discount.handler';
import { TITHE_DISCOUNT_REPOSITORY } from './application/ports/tithe-discount.repository.port';
import { PrismaTitheDiscountRepository } from './infrastructure/prisma-tithe-discount.repository';
import { TitheDiscountsResolver } from './presentation/tithe-discounts.resolver';

@Module({
  imports: [CqrsModule],
  providers: [
    TitheDiscountsResolver,
    CreateTitheDiscountHandler,
    ActivateTitheDiscountHandler,
    ListTitheDiscountsHandler,
    GetActiveTitheDiscountHandler,
    PrismaTitheDiscountRepository,
    {
      provide: TITHE_DISCOUNT_REPOSITORY,
      useExisting: PrismaTitheDiscountRepository,
    },
  ],
})
export class TitheDiscountsModule {}
