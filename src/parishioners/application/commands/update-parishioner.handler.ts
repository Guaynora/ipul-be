import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PARISHIONER_REPOSITORY,
  type ParishionerRepositoryPort,
} from '../ports/parishioner.repository.port';
import { UpdateParishionerCommand } from './update-parishioner.command';

@Injectable()
@CommandHandler(UpdateParishionerCommand)
export class UpdateParishionerHandler implements ICommandHandler<UpdateParishionerCommand> {
  constructor(
    @Inject(PARISHIONER_REPOSITORY)
    private readonly parishionerRepository: ParishionerRepositoryPort,
  ) {}

  execute(command: UpdateParishionerCommand) {
    const data = {
      ...command.payload,
      name: command.payload.name?.trim(),
    };

    return this.parishionerRepository.update(command.id, data);
  }
}
