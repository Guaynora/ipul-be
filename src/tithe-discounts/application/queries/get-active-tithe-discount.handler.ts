import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  TITHE_DISCOUNT_REPOSITORY,
  type TitheDiscountRepositoryPort,
} from '../ports/tithe-discount.repository.port';
import { GetActiveTitheDiscountQuery } from './get-active-tithe-discount.query';

@Injectable()
@QueryHandler(GetActiveTitheDiscountQuery)
export class GetActiveTitheDiscountHandler
  implements IQueryHandler<GetActiveTitheDiscountQuery>
{
  constructor(
    @Inject(TITHE_DISCOUNT_REPOSITORY)
    private readonly titheDiscountRepository: TitheDiscountRepositoryPort,
  ) {}

  execute() {
    return this.titheDiscountRepository.findActive();
  }
}
