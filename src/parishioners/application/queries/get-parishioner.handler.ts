import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PARISHIONER_REPOSITORY,
  type ParishionerRepositoryPort,
} from '../ports/parishioner.repository.port';
import { GetParishionerQuery } from './get-parishioner.query';

@Injectable()
@QueryHandler(GetParishionerQuery)
export class GetParishionerHandler implements IQueryHandler<GetParishionerQuery> {
  constructor(
    @Inject(PARISHIONER_REPOSITORY)
    private readonly parishionerRepository: ParishionerRepositoryPort,
  ) {}

  execute(query: GetParishionerQuery) {
    return this.parishionerRepository.findById(query.id);
  }
}
