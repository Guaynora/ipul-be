import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  TITHE_DISCOUNT_REPOSITORY,
  type TitheDiscountRepositoryPort,
} from '../ports/tithe-discount.repository.port';
import { ListTitheDiscountsQuery } from './list-tithe-discounts.query';

@Injectable()
@QueryHandler(ListTitheDiscountsQuery)
export class ListTitheDiscountsHandler
  implements IQueryHandler<ListTitheDiscountsQuery>
{
  constructor(
    @Inject(TITHE_DISCOUNT_REPOSITORY)
    private readonly titheDiscountRepository: TitheDiscountRepositoryPort,
  ) {}

  execute() {
    return this.titheDiscountRepository.findMany();
  }
}
