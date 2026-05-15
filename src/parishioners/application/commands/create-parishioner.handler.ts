import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PARISHIONER_REPOSITORY,
  type ParishionerRepositoryPort,
} from '../ports/parishioner.repository.port';
import { Inject } from '@nestjs/common';
import { CreateParishionerCommand } from './create-parishioner.command';

@Injectable()
@CommandHandler(CreateParishionerCommand)
export class CreateParishionerHandler implements ICommandHandler<CreateParishionerCommand> {
  constructor(
    @Inject(PARISHIONER_REPOSITORY)
    private readonly parishionerRepository: ParishionerRepositoryPort,
  ) {}

  async execute(command: CreateParishionerCommand) {
    const name = command.payload.name.trim();
    if (!name) {
      throw new BadRequestException('name is required');
    }

    return this.parishionerRepository.create({
      name,
      baptized: command.payload.baptized,
      email: command.payload.email ?? null,
      phone: command.payload.phone ?? null,
      address: command.payload.address ?? null,
    });
  }
}
