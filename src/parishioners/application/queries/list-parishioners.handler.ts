import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PARISHIONER_REPOSITORY,
  type ParishionerRepositoryPort,
} from '../ports/parishioner.repository.port';
import { ListParishionersQuery } from './list-parishioners.query';

@Injectable()
@QueryHandler(ListParishionersQuery)
export class ListParishionersHandler implements IQueryHandler<ListParishionersQuery> {
  constructor(
    @Inject(PARISHIONER_REPOSITORY)
    private readonly parishionerRepository: ParishionerRepositoryPort,
  ) {}

  execute() {
    return this.parishionerRepository.findAll();
  }
}
