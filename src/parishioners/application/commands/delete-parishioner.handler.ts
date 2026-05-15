import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PARISHIONER_REPOSITORY,
  type ParishionerRepositoryPort,
} from '../ports/parishioner.repository.port';
import { DeleteParishionerCommand } from './delete-parishioner.command';

@Injectable()
@CommandHandler(DeleteParishionerCommand)
export class DeleteParishionerHandler implements ICommandHandler<DeleteParishionerCommand> {
  constructor(
    @Inject(PARISHIONER_REPOSITORY)
    private readonly parishionerRepository: ParishionerRepositoryPort,
  ) {}

  async execute(command: DeleteParishionerCommand): Promise<boolean> {
    await this.parishionerRepository.delete(command.id);
    return true;
  }
}
